
import { createServer } from "node:http";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT) || 4000;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});