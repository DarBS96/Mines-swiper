"use strict";
const MINE = "💣";
const FLAG = "🚩";
const LIFE = '💙'

var gBoard;
var gTimerInterval;
var gStart;
var gSmile = '😀'
var gAudioLost = new Audio('sound/gameover.mp3')
var gAudioRetroGame = new Audio('sound/retrogame.mp3')
var gAudioWin = new Audio('sound/win.mp3')

var gLevel = {
  size: 4,
  mines: 2,
};

var gGame = {
  isOn: false,
  isWin: false,
  foundMine: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3
};

function init() {
  gGame.foundMine = false;
  // short if to change the number of life in 'easy' level because there is only two mines
  gGame.lives = (gLevel.size === 4) ? 2 : 3
  gBoard = buildBoard(gLevel.size);
  setRandomMines(gLevel.mines);
  setMinesNegsCount(gBoard);
  renderBoard(gBoard);
  lifeLeft()
  // var elShownCount = document.querySelector(".shown-count");
  // elShownCount.innerText = "Cells shown: " + gGame.shownCount;
  var elTimer = document.querySelector(".timer");
  elTimer.innerText = 'Time : ' + gGame.secsPassed;
  var elMarked = document.querySelector(".marked-count");
  elMarked.innerText = "Cells marked with flags 🚩 : " + gGame.markedCount;
}

function buildBoard(num) {
  var board = [];
  for (var i = 0; i < num; i++) {
    board[i] = [];
    for (var j = 0; j < num; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }

  console.table(board);
  return board;
}

function renderBoard(board) {
  var strHTML = "";
  // console.table(board);
  strHTML += `<button onclick="restart(this)">${gSmile}</button>`
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      var cellContent;
      // if isMine content is MINE
      if (currCell.isMine) {
        cellContent = MINE;
      }
      // else if is number content is number
      else if (currCell.minesAroundCount > 0) {
        cellContent = currCell.minesAroundCount;
      }
      // else content is empty
      else {
        cellContent = "";
      }
      if (currCell.isMarked) {
        cellContent = FLAG;
      }
      if (currCell) var className = !currCell.isShown ? 'hidden' : 'marked';
      strHTML += `
            <td onclick="cellClicked(${i}, ${j})" oncontextmenu="markedClicked(event, ${i}, ${j})" class=" marked ${className}" >
                <span> ${cellContent}</span>
            </td>
            `;
    }
    strHTML += "</tr>";
  }

  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
  // console.log(strHTML)
}

function cellClicked(i, j) {
  var cell = gBoard[i][j];
  // opt 1 : cell is mine
  if (cell.isMine) {
    gGame.lives--
    cell.isShown = true
    gAudioRetroGame.play()
    lifeLeft()
    if (gGame.lives === 0) {
      gGame.foundMine = true;
      cell.isShown = true;
      gAudioLost.play()
      gGame.lives = 3
    }
  }
  // opt 2: cell is a number
  else if (cell.minesAroundCount > 0) {
    cell.isShown = true;
    // gGame.shownCount++;
    // var elShownCount = document.querySelector(".shown-count");
    // elShownCount.innerText = "Cells shown: " + gGame.shownCount;
  }
  // opt 3: cell is empty
  else if (cell.minesAroundCount === 0) {
    cell.isShown = true;
    checkEmptyCellsNegs(i, j, gBoard);
    // gGame.shownCount++;
    // var elShownCount = document.querySelector(".shown-count");
    // elShownCount.innerText = "Cells shown: " + gGame.shownCount;
  }

  startTimerIfNeeded();
  checkGameOver();
  renderBoard(gBoard);
}

function startTimerIfNeeded() {
  if (!gGame.isOn && !gGame.isWin && !gGame.foundMine) {
    gStart = Date.now();
    gTimerInterval = setInterval(timer, 10);
    gGame.isOn = true;
  }
}

function markedClicked(elCell, i, j) {
  startTimerIfNeeded();
  var cell = gBoard[i][j];
  cell.isMarked = true;
  cell.isShown = true;
  elCell.preventDefault();
  console.log(elCell);
  gGame.markedCount++;
  renderBoard(gBoard);
  checkGameOver();
  var elMarked = document.querySelector(".marked-count");
  elMarked.innerText = "Cells marked with flags 🚩 : " + gGame.markedCount;
}

function timer() {
  console.log("inTimer");
  var milliseconds = Date.now() - gStart;
  var elTimer = document.querySelector(".timer");
  gGame.secsPassed = parseInt(milliseconds / 1000);
  elTimer.innerText = 'Time : ' + gGame.secsPassed;
}

function gameOverLost() {
  if (gTimerInterval) {
    clearInterval(gTimerInterval);
    gTimerInterval = null;
  }
  gGame.isOn = false;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];

      if (cell.isMine) {
        cell.isShown = true;
        // gGame.shownCount++
      } else if (!cell.isMine) {
        cell.isShown = false;
        gGame.shownCount = 0
      }
    }
  }
}

function checkGameOver() {
  
  if (gGame.foundMine) {
    // lost - clicked on mine
    gSmile = '😩'
    gameOverLost();

  } else {
    // check if winning
    gGame.isWin = true
    for (var i = 0; i < gBoard.length; i++) {
      if (!gGame.isWin) {
        break;
      }
      for (var j = 0; j < gBoard[0].length; j++) {
        var cell = gBoard[i][j];
        if ((cell.isMine && !cell.isMarked) || !cell.isShown) {
          gGame.isWin = false
          break
        }
      }
    }
    if (gGame.isWin) {
      gSmile = '👑';
      gGame.isOn = false;
      gAudioWin.play()
    }
  }
}

function setRandomMines(mines) {
  var minesCount = 0
  while (minesCount < mines) {
    var randI = getRandomInt(0, gLevel.size);
    var randJ = getRandomInt(0, gLevel.size);
    var cell = gBoard[randI][randJ];
    if (cell.isMine) {
      // console.log("collision!");
      continue;
    } else {
      cell.isMine = true;
      console.log(
        `mine number ${minesCount + 1} is in indexes : (${randI},${randJ})`
      )
    }
    minesCount++;
  }
}

function lifeLeft() {
  var elLife = document.querySelector('.life')
  var strHTML = ''
  // strHTML += 'Lives Left: '
  for (var i = 0; i < gGame.lives; i++) {
    strHTML += `${LIFE}`
  }
  elLife.innerHTML = strHTML
}

function restart() {
  gSmile = '😀'
  // gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.isOn = false
  gGame.foundMine = false
  gGame.isWin = false
  gGame.secsPassed = 0
  gGame.lives = 3
  clearInterval(gTimerInterval)
  lifeLeft()
  init()
}