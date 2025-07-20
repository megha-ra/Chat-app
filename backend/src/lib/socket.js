import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Adjust this to your frontend URL
    },
});


export function getReceiverSocketId(userId){
    // This function retrieves the socket ID for a given user ID
    return userSocketMap[userId];
}
// Map to keep track of online users
const userSocketMap = {}; //{userId: socketId}
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId)  userSocketMap[userId] = socket.id;
    // io.emit() is used to broadcast messages to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        // Remove the user from the userSocketMap
        const userId = Object.keys(userSocketMap).find(id => userSocketMap[id] === socket.id);
        if (userId) delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


export {io, app, server};