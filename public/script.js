const size = 15;
const board = [];
let currentPlayer = '⚫';
const moveStack = [];
const socket = io();
const room = 'room1'; // 假設玩家都進入同一個房間

const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const undoButton = document.getElementById('undo-button');

socket.emit('join', room);

socket.on('update', (newBoard) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            board[i][j] = newBoard[i][j];
            const cell = document.querySelector(`[data-row='${i}'][data-col='${j}']`);
            cell.textContent = newBoard[i][j];
        }
    }
});

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
        socket.emit('move', { room, row, col, player: currentPlayer });
    }
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
