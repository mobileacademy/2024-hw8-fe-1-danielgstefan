let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;

let bombProbability = 3;
let maxProbability = 15;

function minesweeperGameBootstrapper(rowCount, colCount) {
    let easy = {
        'rowCount': 9,
        'colCount': 9,
        'bombProbability': 3
    };

    let medium = {
        'rowCount': 16,
        'colCount': 16,
        'bombProbability': 5
    };

    let expert = {
        'rowCount': 16,
        'colCount': 30,
        'bombProbability': 8
    };

    if (rowCount == null && colCount == null) {
        generateBoard(easy);
    } else {
        generateBoard({'rowCount': rowCount, 'colCount': colCount});
    }
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;
    board = [];

    let table = document.getElementById("board");
    table.innerHTML = "";

    for (let i = 0; i < boardMetadata.colCount; i++) {
        board[i] = new Array(boardMetadata.rowCount);
        let row = table.insertRow();
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            let hasBomb = Math.random() * maxProbability < bombProbability;
            board[i][j] = new BoardSquare(hasBomb, 0);
            let cell = row.insertCell();
            cell.addEventListener("click", () => discoverSquare(i, j));
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                flagSquare(i, j);
            });
        }
    }

    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            board[i][j].bombsAround = countBombsAround(i, j, boardMetadata);
        }
    }

    console.log(board);
}

function countBombsAround(x, y, boardMetadata) {
    let bombsAround = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newX = x + i;
            let newY = y + j;
            if (newX >= 0 && newX < boardMetadata.colCount && newY >= 0 && newY < boardMetadata.rowCount) {
                if (board[newX][newY].hasBomb) {
                    bombsAround++;
                }
            }
        }
    }
    return bombsAround;
}

class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
        this.isOpen = false;
        this.isFlagged = false;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function discoverSquare(x, y) {
    let cell = document.getElementById("board").rows[x].cells[y];
    if (board[x][y].isFlagged || board[x][y].isOpen) return;

    if (board[x][y].hasBomb) {
        cell.classList.add("bomb");
        alert("Game over! You hit a bomb.");
        return;
    }

    board[x][y].isOpen = true;
    cell.classList.add("open");
    cell.textContent = board[x][y].bombsAround > 0 ? board[x][y].bombsAround : "";

    openedSquares.push(new Pair(x, y));
    squaresLeft--;

    if (board[x][y].bombsAround === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let newX = x + i;
                let newY = y + j;
                if (newX >= 0 && newX < board.length && newY >= 0 && newY < board[0].length) {
                    if (!board[newX][newY].isOpen) {
                        discoverSquare(newX, newY);
                    }
                }
            }
        }
    }

    if (squaresLeft === bombCount) {
        alert("Congratulations, you won!");
    }
}

function flagSquare(x, y) {
    let cell = document.getElementById("board").rows[x].cells[y];
    if (board[x][y].isOpen) return;

    if (board[x][y].isFlagged) {
        cell.classList.remove("flagged");
        flaggedSquares = flaggedSquares.filter(s => !(s.x === x && s.y === y));
        board[x][y].isFlagged = false;
    } else {
        cell.classList.add("flagged");
        flaggedSquares.push(new Pair(x, y));
        board[x][y].isFlagged = true;
    }
}

function changeDifficulty() {
    let difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") {
        minesweeperGameBootstrapper(9, 9);
    } else if (difficulty === "medium") {
        minesweeperGameBootstrapper(16, 16);
    } else if (difficulty === "expert") {
        minesweeperGameBootstrapper(16, 30);
    }
}

function updateBombProbability() {
    bombProbability = parseInt(document.getElementById("bombProbability").value);
    changeDifficulty();
}

function resetGame() {

    board = [];
    openedSquares = [];
    flaggedSquares = [];
    bombCount = 0;
    squaresLeft = 0;

    changeDifficulty();
}

minesweeperGameBootstrapper(9, 9);
