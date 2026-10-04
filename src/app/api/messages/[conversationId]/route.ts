import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth/requireAuth";
import Conversation from "@/models/conversation.model";
import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/message.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const currentUser = await requireAuth(request);

    const { conversationId } = await params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid conversation ID",
        },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUser._id,
    });

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation not found",
        },
        { status: 404 }
      );
    }

    const messages = await Message.find({
      conversationId,
    }).sort({ createdAt: 1 });

    return NextResponse.json(
      {
        success: true,
        message: "Messages fetched successfully",
        messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get messages error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}