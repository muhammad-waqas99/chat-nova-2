import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import User from "@/models/user.model";
import { connectToDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function requireAuth(request: NextRequest) {
  await connectToDB();

  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded !== "object" || !decoded.id) {
    throw new Error("Unauthorized");
  }

  const user = await User.findById(decoded.id).select(
    "-passwordHash"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}