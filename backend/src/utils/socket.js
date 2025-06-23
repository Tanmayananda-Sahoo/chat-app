import {Server} from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

const userSocketMap = {};

export function getRecieverId(userId) {
    return userSocketMap[userId];
}
io.on("connection", async(socket) => {
    console.log('A User connected: ',socket.id);
    const userId = await socket.handshake.query.userId;
    console.log('socket handshake id: ',userId);
    console.log("🔄 Current user map:", userSocketMap);

    if(userId) {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        
    }
    socket.on("disconnect", () => {
        console.log('A User got disconnected: ', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})
export {io, app, server};