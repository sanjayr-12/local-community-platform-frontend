"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthService } from "@/lib/services/auth-service";

export default function Home() {
  const { user, login, token, hasHydrated } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      router.push("/get-started");
    } else {
      AuthService.getMe()
        .then((freshUser) => {
          if (token && JSON.stringify(freshUser) !== JSON.stringify(user)) {
            login(freshUser, token);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user profile:", error);
        });
    }
  }, [user, router, login, token, hasHydrated]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Home</h1>
      <p className="text-muted-foreground mt-4">Welcome back, {user.name}!</p>
    </div>
  );
}
