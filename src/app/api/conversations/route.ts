import { requireAuth } from "@/lib/auth/requireAuth";
import Conversation from "@/models/conversation.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const conversations = await Conversation.find({
      participants: user._id,
    }).populate("participants", "name email");

    const formattedConversations = conversations.map((conversation) => {
      const otherUser = conversation.participants.find(
        (participant: any) =>
          participant._id.toString() !== user._id.toString()
      );

      return {
        conversationId: conversation._id,
        user: otherUser,
      };
    });

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}