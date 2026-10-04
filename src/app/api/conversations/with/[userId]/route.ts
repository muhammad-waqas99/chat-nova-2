import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth/requireAuth";
import Conversation from "@/models/conversation.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUser = await requireAuth(request);

    const { userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findOne({
      participants: {
        $all: [currentUser._id, userId],
      },
    });

    return NextResponse.json(
      {
        success: true,
        conversation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get conversation with user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}