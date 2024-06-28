const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {}; // 用來儲存遊戲房間

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (room) => {
        socket.join(room);
        if (!rooms[room]) {
            rooms[room] = { board: Array(15).fill().map(() => Array(15).fill(' ')), players: [] };
        }
        rooms[room].players.push(socket.id);
        io.to(room).emit('update', rooms[room].board);
    });

    socket.on('move', (data) => {
        const { room, row, col, player } = data;
        if (rooms[room].board[row][col] === ' ') {
            rooms[room].board[row][col] = player;
            io.to(room).emit('update', rooms[room].board);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // 處理玩家斷線邏輯
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('listening on *:3000');
});
