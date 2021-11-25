function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            cell.minesAroundCount = countMinesNegs(i, j, board)
            console.log('i: ' + i + 'j: ' + j, 'cell.minesAroundCount ', cell.minesAroundCount)
        }
    }
}
function countMinesNegs(cellI, cellJ, mat) {
    var negsMinesCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > mat[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;

            if (mat[i][j]) {
                if (mat[i][j].isMine) {
                    negsMinesCount++
                }
            }
        }
    }
    return negsMinesCount;
}


function checkEmptyCellsNegs(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > mat[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j]) {
                var cell = mat[i][j]
                if (cell.minesAroundCount === 0) {
                    cell.isShown = true
                }
                if (cell.minesAroundCount > 0) {
                    cell.isShown = true
                }
                if (cell.isMine) {
                    cell.isShown = false
                }
                gGame.shownCount++
            }
        }
    }
}

function drawNum() {
    var idx = getRandomInt(0, gNums.length);
    var num = gNums[idx];
    gNums.splice(idx, 1);
    return num;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
