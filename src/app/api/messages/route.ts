import { requireAuth } from "@/lib/auth/requireAuth";
import Conversation from "@/models/conversation.model";
import Message from "@/models/message.model";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth(request);

    const reqBody = await request.json();

    const { conversationId, receiverId, text } = reqBody;
if (!text?.trim()) {
  return NextResponse.json(
    {
      success: false,
      message: "Message text is required",
    },
    { status: 400 }
  );
}
    if (!mongoose.Types.ObjectId.isValid(receiverId) && !mongoose.Types.ObjectId.isValid(conversationId) ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid receiver or conversation id ",
        },
        { status: 400 }
      );
    }

    if (conversationId) {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: currentUser._id,
      });

      if (!conversation) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid conversation ID",
          },
          { status: 404 }
        );
      }

      const message = await Message.create({
        conversationId,
        senderId: currentUser._id.toString(),
        text,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Message sent successfully",
          data: message,
        },
        { status: 201 }
      );
    }

    if (receiverId) {
      const receiverUser = await User.findById(receiverId);

      if (!receiverUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid receiver ID",
          },
          { status: 404 }
        );
      }

      let conversation = await Conversation.findOne({
        participants: {
          $all: [currentUser._id, receiverId],
        },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [currentUser._id, receiverId],
        });
      }

      const message = await Message.create({
        conversationId: conversation._id.toString(),
        senderId: currentUser._id.toString(),
        text,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Message sent successfully",
          data: message,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Conversation ID or receiver ID is required",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Post messages error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}