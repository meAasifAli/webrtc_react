// index.js
import express from 'express'
import { Server } from 'socket.io';
import http from 'http'

const app = express();

const server = http.createServer(app)
const io = new Server(server, {
    cors: true
})

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`Client joined room: ${room}`);
    });

    socket.on('offer', (data) => {
        socket.to(data.room).emit('offer', { offer: data.offer, from: socket.id });
    });

    socket.on('answer', (data) => {
        socket.to(data.to).emit('answer', { answer: data.answer });
    });

    socket.on('candidate', (data) => {
        socket.to(data.to).emit('candidate', { candidate: data.candidate });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
