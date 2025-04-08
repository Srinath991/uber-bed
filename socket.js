import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import UserModel from "./models/UserModel.js";
import CaptainModel from "./models/CaptainModel.js";

let io;

export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // attach user to socket object

            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`✅ Client connected: ${socket.id} | User ID: ${socket.user._id}`);
        socket.on('join', async ({ userType }) => {
            if (userType === 'user') {
                await UserModel.findByIdAndUpdate(socket.user._id, { socketId: socket.id });
            } else if (userType === 'captain') {
                await CaptainModel.findByIdAndUpdate(socket.user._id, { socketId: socket.id });
            }
        });
        socket.on('update-location-captain', async ({ location }) => {
            const { lat, lng } = location
            if (!location || lat || lng) {
                await CaptainModel.findByIdAndUpdate(socket.user._id, {
                    location: {
                      type: "Point",
                      coordinates: [lng, lat]
                    }
                  });
            
            }

        })

        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });
}

export function sendMessageToSocketId(socketId,event,message) {
    if (io) {
        io.to(socketId).emit(event, message);
    } else {
        console.log("Socket.io not initialized.");
    }
}
