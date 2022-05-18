import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app";
import dbConnector from "./config";
import { Server as socketio } from "socket.io";
import Logger from "./logger/logger";
import { writeMessageToDB } from "./handlers/messages";

import { decodeToken, jwtMiddleware } from "./middlewares/jwt";

const PORT = process.env.PORT;

const server = http.createServer(app);

export const io = new socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ["cookies"],
    credentials: true,
  },
});

(async () => {
  try {
    await dbConnector();
    Logger.info("DB connected");
    server.listen(PORT, () => {
      Logger.info(`Server started on port ${PORT}`);
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
      socket.emit("message", "Welcome to the chat");

      // ON JOIN ROOM JOIN SAID SOCKET TO SAID ROOM
      socket.on("joinRoom", async (room_id) => {
        await socket.join(room_id);
        Logger.info(`Socket ${socket.id} joined room ${room_id}`);

        socket.to(room_id).emit("update", "successfully joined!");
      });

      // ON MESSAGE: UPDATE EVERYONE ELSE
      socket.on("message", async (data) => {
        Logger.info(`Socket ${socket.id} sent message ${data}`);

        const newData = {
          'eventName': "update",
          content: data.content,
          sentBy: data.sentBy,
          createdAt: new Date(),
          room_id: data.room_id,
        }

        await socket.to(data.room_id).emit("update", newData);
        await writeMessageToDB(newData);
      });
    });
  } catch (error) {
    Logger.error(error);
  }
})();
