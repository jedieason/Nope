const size = 15;
const board = [];
let currentPlayer = '⚫';
const moveStack = [];

const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const undoButton = document.getElementById('undo-button');

function initBoard() {
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = ' ';
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.left = `${j * 32 - 16}px`;
            cell.style.top = `${i * 32 - 16}px`;
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    if (board[row][col] === ' ' && !message.textContent) {
        board[row][col] = currentPlayer;
        event.target.textContent = currentPlayer;
        moveStack.push({row, col});
        if (checkWin(row, col)) {
            showMessage(`玩家 ${currentPlayer} 贏了！`);
        } else {
            currentPlayer = currentPlayer === '⚫' ? '⚪' : '⚫';
        }
    }
}

function checkWin(row, col) {
    row = parseInt(row);
    col = parseInt(col);
    const directions = [
        {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: 1, dy: 1}, {dx: 1, dy: -1}
    ];
    for (const {dx, dy} of directions) {
        let count = 1;
        for (let step of [1, -1]) {
            let x = row + dx * step;
            let y = col + dy * step;
            while (x >= 0 && x < size && y >= 0 && y < size && board[x][y] === currentPlayer) {
                count++;
                x += dx * step;
                y += dy * step;
            }
        }
        if (count >= 5) return true;
    }
    return false;
}

function showMessage(msg) {
    message.textContent = msg;
    message.style.display = 'block';
}

function hideMessage() {
    message.style.display = 'none';
}

function undoMove() {
    console.log('Undo button clicked');  // 確認是否執行
    if (moveStack.length > 0 && message.style.display === 'none') {
        const lastMove = moveStack.pop();
        board[lastMove.row][lastMove.col] = ' ';
        document.querySelector(`[data-row='${lastMove.row}'][data-col='${lastMove.col}']`).textContent = '';
        currentPlayer = currentPlayer === '⚫' ? '⚪' : '⚫';
    }
}

undoButton.addEventListener('click', undoMove);

initBoard();
hideMessage();  // 初始化時隱藏訊息
