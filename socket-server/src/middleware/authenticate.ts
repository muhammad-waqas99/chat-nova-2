
import jwt, { JwtPayload } from "jsonwebtoken";
import type { Socket } from "socket.io";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function authenticateSocket(
  socket: Socket,
  next: (error?: Error) => void
) {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Unauthorized"));
    }

    const authCookie = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("authToken="));

    const token = authCookie?.slice("authToken=".length);

    if (!token) {
      return next(new Error("Unauthorized"));
    }
    if (!JWT_SECRET) {
      return next(new Error("Jwt Secret Required"));
    }

    
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === "string" ||
      !("id" in decoded) ||
      typeof (decoded as JwtPayload).id !== "string"
    ) {
      return next(new Error("Unauthorized"));
    }

    socket.data.userId = (decoded as JwtPayload).id;

    next();
  } catch {
    return next(new Error("Unauthorized"));
  }
}