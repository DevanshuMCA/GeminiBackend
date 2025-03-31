import http from "http"
import app from "./app.js"
import dotenv from "dotenv"
import { Server } from "socket.io";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";
dotenv.config()
const port = process.env.PORT

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.use(async (socket, next) => {
    try {

        const token = socket.handshake.auth.token || (socket.handshake.headers.authorization?.split(" ")[1]);

        const projectId = socket.handshake.query.projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error("Authentication Error"));
        }
        socket.project = await projectModel.findById(projectId)
        if (!token) {
            return next(new Error("Authentication Error"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return next(new Error("Authentication Error"));
        }
        socket.user = decoded

        next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Internal Server Error"));
    }
});

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString()
    console.log(socket.roomId)
    socket.join(socket.roomId)
    socket.removeAllListeners('project-message');
    socket.on('project-message', async (data) => {
        const message = data.message;
        console.log(message);
        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message', data);
        if (aiIsPresentInMessage) {
            const prompt = message.replace('@ai', '');
            try {
                const result = await generateResult(prompt);
                io.to(socket.roomId).emit('project-message', {
                    message: result,
                    sender: {
                        _id: 'ai',
                        email: 'AI',
                    },
                });
            } catch (error) {
                console.error('AI generation error:', error);
                io.to(socket.roomId).emit('project-message', {
                    message: 'Error generating AI response.',
                    sender: {
                        _id: 'ai',
                        email: 'AI',
                    },
                });
            }
            return;
        }
    
        
    });
    
    

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected from room ${socket.roomId}`);
        // Optionally broadcast that the user left the room
    });
    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { /* … */ });
});

server.listen(port, () => {
    console.log("server is running on port", port)
})