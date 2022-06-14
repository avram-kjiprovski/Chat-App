import { Server as socketio } from "socket.io";
import Logger from "../logger/logger";
import http from "http";
import app from "../app";
import { v4 } from "uuid";
import { MessageService } from "@/services/messageService";
import { JWTService } from "@/middlewares/jwt";

export const server = http.createServer(app);

export const io = new socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ["cookies"],
    credentials: true,
  },
});

// Socket.io
io.use(async (socket, next) => {
  Logger.info("Socket checking token ");
  if (typeof socket.handshake.headers.cookie === "string") {
    
  const jwtService = new JWTService();
  const decoded: Object | any = await jwtService.decodeToken(
    socket.handshake.headers.cookie.split("=")[1]
  );


    decoded ? next() : next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  Logger.info("Socket connected");

  // ON JOIN ROOM JOIN SAID SOCKET TO SAID ROOM
  socket.on("joinRoom", async (room_id) => {
    await socket.join(room_id);
    Logger.info(`Socket ${socket.id} joined room ${room_id}`);
    // I may return a object of the room that the user has joined to make sure everything is up to date
  });

  // ON MESSAGE: UPDATE EVERYONE ELSE
  socket.on("message", async (data) => {
    Logger.info(`Socket ${socket.id} sent message ${data}`);

    const newData = {
      eventName: "update",
      content: data.content,
      sentBy: data.sentBy,
      createdAt: new Date(),
      room_id: data.room_id,
    };

    await socket.to(data.room_id).emit("update", {
      ...newData,
      message_id: v4(),
    });
    const messageService = new MessageService();
    await messageService.writeMessage(newData);
  });
});
