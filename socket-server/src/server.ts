
import "dotenv/config";

import { createServer } from "node:http";
import { Server } from "socket.io";

import { authenticateSocket } from "./middleware/authenticate.js";

const PORT = Number(process.env.PORT) || 4000;

const httpServer = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        success: true,
        message: "Socket server is healthy",
      })
    );

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      success: false,
      message: "Route not found",
    })
  );
});

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