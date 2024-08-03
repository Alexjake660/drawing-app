import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket is already running");
  }
  res.end();
};

export default SocketHandler;
