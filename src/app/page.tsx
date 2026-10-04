"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Conversation {
  conversationId: string;
  user: User;
}

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userResponse, usersResponse, conversationsResponse] =
          await Promise.all([
            axios.get("/api/auth/me"),
            axios.get("/api/users"),
            axios.get("/api/conversations"),
          ]);

        setUser(userResponse.data.user);
        setUsers(usersResponse.data.users);
        setConversations(conversationsResponse.data.conversations);
      } catch (error) {
        console.error("Fetch data error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleUserClick(selectedUser: User) {
    try {
      setActiveUser(selectedUser);
      setMessages([]);
      setActiveConversationId(null);

      const response = await axios.get(
        `/api/conversations/with/${selectedUser._id}`
      );

      const conversation = response.data.conversation;

      if (!conversation) {
        return;
      }

      setActiveConversationId(conversation._id);

      const messagesResponse = await axios.get(
        `/api/messages/${conversation._id}`
      );

      setMessages(messagesResponse.data.messages);
    } catch (error) {
      console.error("Open conversation error:", error);
    }
  }

  async function handleSendMessage() {
    if (!messageText.trim() || !activeUser || isSending) {
      return;
    }

    try {
      setIsSending(true);

      const requestBody = activeConversationId
        ? {
            conversationId: activeConversationId,
            text: messageText,
          }
        : {
            receiverId: activeUser._id,
            text: messageText,
          };

      const response = await axios.post("/api/messages", requestBody);

      const newMessage = response.data.data;

      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ]);

      setMessageText("");

      if (!activeConversationId) {
        setActiveConversationId(newMessage.conversationId);

        const conversationsResponse = await axios.get(
          "/api/conversations"
        );

        setConversations(
          conversationsResponse.data.conversations
        );
      }
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setIsSending(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold">Chat Nova</h1>

        {user && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Welcome, {user.name}
            </p>

            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-8">

          <section>
            <h2 className="text-lg font-semibold">
              Users to Chat With
            </h2>

            <div className="mt-4 space-y-3">
              {users.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No users found.
                </p>
              ) : (
                users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    className="block w-full rounded-lg border p-4 text-left hover:bg-gray-50"
                  >
                    <p className="font-medium">{user.name}</p>

                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border p-5">
            {!activeUser ? (
              <div className="flex min-h-80 items-center justify-center">
                <p className="text-sm text-gray-500">
                  Select a user to start chatting.
                </p>
              </div>
            ) : (
              <>
                <div className="border-b pb-4">
                  <p className="font-semibold">
                    {activeUser.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {activeUser.email}
                  </p>
                </div>

 
                <div className="min-h-80 space-y-3 py-5">
                  {messages.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No messages yet. Send the first message.
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`rounded-lg border p-3 ${
                          message.senderId === user?._id
                            ? "ml-auto max-w-[80%]"
                            : "mr-auto max-w-[80%]"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    ))
                  )}
                </div>


                <div className="flex gap-2 border-t pt-4">
                  <input
                    value={messageText}
                    onChange={(event) =>
                      setMessageText(event.target.value)
                    }
                    placeholder="Write a message..."
                    className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={isSending}
                    className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {isSending ? "Sending..." : "Send"}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>


        <section className="mt-10">
          <h2 className="text-lg font-semibold">
            Conversations
          </h2>

          <div className="mt-4 space-y-3">
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-500">
                No conversations yet.
              </p>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.conversationId}
                  className="rounded-lg border p-4"
                >
                  <p className="font-medium">
                    {conversation.user.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {conversation.user.email}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}