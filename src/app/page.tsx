"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get("/api/auth/me");

        setUser(response.data.user);
      } catch (error) {
        console.error("Fetch user error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">
          Chat Nova
        </h1>

        {user && (
          <div className="mt-4 space-y-1">
            <p className="text-sm text-gray-600">
              Welcome, {user.name}
            </p>

            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}