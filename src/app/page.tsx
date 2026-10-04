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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
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

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Users to Chat With</h2>

          <div className="mt-4 space-y-3">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500">
                No users found.
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="rounded-lg border p-4"
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Conversations</h2>

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

                  <p className="mt-1 text-xs text-gray-400">
                    Conversation ID: {conversation.conversationId}
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