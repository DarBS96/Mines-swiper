'use strict'
const MINE = '💣'
const FLAG = '🚩'

var gBoard;
var gLevel;
var gGame;
var gTimerInterval;
var gStart;

gLevel = {
    SIZE: 4,
    MINES: 2
}

gGame = {
    isOn: false,
    foundMine: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    gGame.foundMine = false
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES)
    renderBoard(gBoard)
    gStart = Date.now()
    var elShownCount = document.querySelector('.shown-count')
    elShownCount.innerText = 'cells shown: ' + gGame.shownCount
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 'Time passed: ' + gGame.secsPassed
    var elMarked = document.querySelector('.marked-count')
    elMarked.innerText = 'cells marked with flags: ' + gGame.markedCount
}

function buildBoard(num, mines) {
    var board = [];
    for (var i = 0; i < num; i++) {
        board[i] = [];
        for (var j = 0; j < num; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }

    }
    board[2][3].isMine = true
    board[2][2].isMine = true

    setMinesNegsCount(board)

    console.table(board)
    return board;
}

function renderBoard(board) {

    var strHTML = ''
    // console.table(board);
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellContent
            // if isMine content is MINE
            if (currCell.isMine) {
                cellContent = MINE
            }
            // else if is number content is number 
            else if (currCell.minesAroundCount > 0) {
                cellContent = currCell.minesAroundCount
            }
            // else content is empty
            else {
                cellContent = ''
            }
            if (currCell.isMarked) {
                cellContent = FLAG
            }
            if (currCell)
                var className = (!currCell.isShown) ? 'hidden' : ''
            strHTML += `
            <td onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="markedClicked(event, ${i}, ${j})" class=" marked ${className}" >
                <span> ${cellContent}</span>
            </td>
            `
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // console.log(strHTML)
}

function cellClicked(elCell, i, j) {
    if (!gGame.foundMine) {
        var cell = gBoard[i][j]

        // opt 1: cell is a number
        if (cell.minesAroundCount > 0) {
            if (!gGame.isOn) {
                gTimerInterval = setInterval(timer, 10)
            }
            cell.isShown = true
            gGame.shownCount++
            var elShownCount = document.querySelector('.shown-count')
            elShownCount.innerText = 'cells shown: ' + gGame.shownCount
        }

        // opt 2: cell isMine- lose
        if (cell.isMine) {
            debugger;
            if (gTimerInterval) {
                clearInterval(gTimerInterval)
                gTimerInterval = null;
            }
            gameOverLost()
            cell.isShown = true
            gGame.foundMine = true
        }
        // opt 3: cell is empty
        if (cell.minesAroundCount === 0) {
            if (!gGame.isOn) {
                gTimerInterval = setInterval(timer, 10)
            }
            cell.isShown = true
            checkEmptyCellsNegs(i, j, gBoard)
            gGame.shownCount++
            var elShownCount = document.querySelector('.shown-count')
            elShownCount.innerText = 'cells shown: ' + gGame.shownCount
        }
        gGame.isOn = true
        renderBoard(gBoard)
        checkGameOver()
    }
}

function markedClicked(elCell, i, j) {
    debugger;
    gTimerInterval = setInterval(timer, 10)
    var cell = gBoard[i][j]
    cell.isMarked = true
    cell.isShown = true
    elCell.preventDefault()
    console.log(elCell)
    gGame.markedCount++
    renderBoard(gBoard)
    checkGameOver()
    var elMarked = document.querySelector('.marked-count')
    elMarked.innerText = 'cells marked with flags: ' + gGame.markedCount
}

function timer() {
    console.log('inTimer');
    var milliseconds = (Date.now() - gStart);
    var elTimer = document.querySelector('.timer')
    gGame.secsPassed = parseInt(milliseconds / 1000)
    elTimer.innerText = 'Time passed: ' + gGame.secsPassed
}

// function timer() {
//     gGame.secsPassed++
//     var elTimer = document.querySelector('.timer')
//     elTimer.innerText = 'Time passed: ' + gGame.secsPassed
// }



function gameOverLost() {
    gGame.isOn = false
    // gTimerInterval =  clearInterval(gTimerInterval)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]

            if (cell.isMine) {
                cell.isShown = true
            } else if (!cell.isMine) {
                cell.isShown = false
            }
        }
    }
    // alert ('lost!')
}

function checkGameOver() {
    gGame.isOn = true
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]

            if (cell.isMine) {
                if (cell.isMarked === false) {
                    gGame.isOn = false
                }
            } else {
                if (cell.isShown === false) {
                    gGame.isOn = false
                }
            }
            
        }
    }
    // gTimerInterval = clearInterval(gTimerInterval)
    if (gGame.isOn) {
        alert('victorious!')
    }
}


function setLevel(lvl, mines) {
    gLevel.SIZE = lvl
    gLevel.MINES = mines
    // restart()
    init()
}

function setRandomMines() {
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            mines.push({ i, j })
        }
    }
    var randIdx = getRandomInt(0, mines.length)
    return mines[randIdx]

}