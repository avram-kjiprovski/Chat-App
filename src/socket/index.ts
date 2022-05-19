import { Server as socketio } from "socket.io";
import { decodeToken, jwtMiddleware } from "../middlewares/jwt";
import { writeMessageToDB } from "../handlers/messages";
import Logger from "../logger/logger";
import http from "http";
import app from "../app";

export const server = http.createServer(app);

export const io = new socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ["cookies"],
    credentials: true,
  },
});

// Socket.io
io.use(async (socket, next) => {
  Logger.info("Socket checking token ");
  if (typeof socket.handshake.headers.cookie === "string") {
    const decoded: Object | any = await decodeToken(
      socket.handshake.headers.cookie.split("=")[1]
    );

    if (decoded) {
      next();
    } else {
      next(new Error("Authentication error"));
    }
  }
});

io.on("connection", (socket) => {
  Logger.info("Socket connected");

  // ON JOIN ROOM JOIN SAID SOCKET TO SAID ROOM
  socket.on("joinRoom", async (room_id) => {
    await socket.join(room_id);
    Logger.info(`Socket ${socket.id} joined room ${room_id}`);
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

    await socket.to(data.room_id).emit("update", newData);
    await writeMessageToDB(newData);
  });
});