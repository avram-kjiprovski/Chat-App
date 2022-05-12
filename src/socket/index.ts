import { io } from "../server";
import { decodeToken, jwtMiddleware } from "../middlewares/jwt";
import { writeMessageToDB } from "../handlers/messages";
import Logger from "../logger/logger";

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

  socket.on("joinRoom", async (room_id) => {
    await socket.join(room_id);
    Logger.info(`Socket ${socket.id} joined room ${room_id}`);

    socket.to(room_id).emit("update", "successfully joined!");
  });

  socket.on("message", async (data) => {
    Logger.info(`Socket ${socket.id} sent message ${data}`);

    await socket.to(data.room).emit("update", data.message);
    const handlerReturn = await writeMessageToDB(data);
    console.log(handlerReturn);
  });
});
