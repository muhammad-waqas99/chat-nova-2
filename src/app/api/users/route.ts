import { requireAuth } from "@/lib/auth/requireAuth";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const allUsers = await User.find({
      _id: { $ne: user._id },
    }).select("name email");

    return NextResponse.json(
      {
        success: true,
        message: "Users fetched successfully",
        users: allUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}