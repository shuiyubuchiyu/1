const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// 存储房间和玩家信息
const rooms = {};

io.on('connection', (socket) => {
    console.log('新玩家连接:', socket.id);

    // 创建或加入房间
    socket.on('joinRoom', (roomId) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {
                players: [],
                board: getInitialBoard(),
                currentPlayer: 'red'
            };
        }

        const room = rooms[roomId];
        
        if (room.players.length < 2) {
            const color = room.players.length === 0 ? 'red' : 'black';
            room.players.push({
                id: socket.id,
                color: color
            });
            
            socket.join(roomId);
            socket.roomId = roomId;
            socket.color = color;
            
            // 发送初始棋盘和玩家颜色
            io.to(roomId).emit('gameInit', {
                board: room.board,
                color: color,
                currentPlayer: room.currentPlayer
            });

            // 如果两个玩家都加入了，开始游戏
            if (room.players.length === 2) {
                io.to(roomId).emit('gameStart', {
                    board: room.board,
                    currentPlayer: room.currentPlayer
                });
            }
        } else {
            socket.emit('roomFull', '房间已满');
        }
    });

    // 处理棋子移动
    socket.on('movePiece', (data) => {
        const room = rooms[socket.roomId];
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (!player || player.color !== room.currentPlayer) return;

        // 验证移动是否合法（简化版，实际应该有更严格的规则）
        const { from, to } = data;
        const piece = room.board[from.row][from.col];
        
        // 检查是否是自己的棋子
        if (!piece || piece.color !== player.color) return;

        // 更新棋盘
        room.board[to.row][to.col] = piece;
        room.board[from.row][from.col] = null;

        // 切换玩家
        room.currentPlayer = room.currentPlayer === 'red' ? 'black' : 'red';

        // 广播移动结果
        io.to(socket.roomId).emit('pieceMoved', {
            board: room.board,
            currentPlayer: room.currentPlayer,
            from: from,
            to: to
        });

        // 检查是否获胜（简化版：检查将/帅是否被吃）
        checkWinCondition(room, socket.roomId);
    });

    // 玩家断开连接
    socket.on('disconnect', () => {
        console.log('玩家断开连接:', socket.id);
        
        if (socket.roomId && rooms[socket.roomId]) {
            const room = rooms[socket.roomId];
            room.players = room.players.filter(p => p.id !== socket.id);
            
            io.to(socket.roomId).emit('playerLeft', socket.id);
            
            // 如果房间空了，删除房间
            if (room.players.length === 0) {
                delete rooms[socket.roomId];
            }
        }
    });
});

// 获取初始棋盘布局
function getInitialBoard() {
    const board = Array(10).fill(null).map(() => Array(9).fill(null));
    
    // 黑方棋子（上方）
    board[0][0] = { type: 'ju', color: 'black' };
    board[0][1] = { type: 'ma', color: 'black' };
    board[0][2] = { type: 'xiang', color: 'black' };
    board[0][3] = { type: 'shi', color: 'black' };
    board[0][4] = { type: 'jiang', color: 'black' };
    board[0][5] = { type: 'shi', color: 'black' };
    board[0][6] = { type: 'xiang', color: 'black' };
    board[0][7] = { type: 'ma', color: 'black' };
    board[0][8] = { type: 'ju', color: 'black' };
    board[2][1] = { type: 'pao', color: 'black' };
    board[2][7] = { type: 'pao', color: 'black' };
    board[3][0] = { type: 'zu', color: 'black' };
    board[3][2] = { type: 'zu', color: 'black' };
    board[3][4] = { type: 'zu', color: 'black' };
    board[3][6] = { type: 'zu', color: 'black' };
    board[3][8] = { type: 'zu', color: 'black' };
    
    // 红方棋子（下方）
    board[9][0] = { type: 'ju', color: 'red' };
    board[9][1] = { type: 'ma', color: 'red' };
    board[9][2] = { type: 'xiang', color: 'red' };
    board[9][3] = { type: 'shi', color: 'red' };
    board[9][4] = { type: 'shuai', color: 'red' };
    board[9][5] = { type: 'shi', color: 'red' };
    board[9][6] = { type: 'xiang', color: 'red' };
    board[9][7] = { type: 'ma', color: 'red' };
    board[9][8] = { type: 'ju', color: 'red' };
    board[7][1] = { type: 'pao', color: 'red' };
    board[7][7] = { type: 'pao', color: 'red' };
    board[6][0] = { type: 'bing', color: 'red' };
    board[6][2] = { type: 'bing', color: 'red' };
    board[6][4] = { type: 'bing', color: 'red' };
    board[6][6] = { type: 'bing', color: 'red' };
    board[6][8] = { type: 'bing', color: 'red' };
    
    return board;
}

// 检查胜利条件
function checkWinCondition(room, roomId) {
    let redShuai = false;
    let blackJiang = false;
    
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
            const piece = room.board[i][j];
            if (piece && piece.type === 'shuai') redShuai = true;
            if (piece && piece.type === 'jiang') blackJiang = true;
        }
    }
    
    if (!redShuai) {
        io.to(roomId).emit('gameOver', { winner: 'black' });
    } else if (!blackJiang) {
        io.to(roomId).emit('gameOver', { winner: 'red' });
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('局域网内的其他设备可以通过 http://你的IP地址:3000 访问');
});
