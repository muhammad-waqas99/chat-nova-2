
import "dotenv/config";

import { createServer } from "node:http";
import { Server } from "socket.io";

import { authenticateSocket } from "./middleware/authenticate.js";

const PORT = Number(process.env.PORT) || 4000;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(authenticateSocket);

io.on("connection", (socket) => {
  console.log(
    "Authenticated socket connected:",
    socket.id,
    "User:",
    socket.data.userId
  );

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});