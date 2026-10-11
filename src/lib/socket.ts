import { io } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

if (!socketUrl) {
  throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined");
}

export const socket = io(socketUrl, {
  autoConnect: false, 
  withCredentials:true
});