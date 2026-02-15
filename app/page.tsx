"use client";

import { useAuthStore, type User } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/lib/services/auth-service";

import { Navbar } from "@/components/layout/Navbar";
import { LeftSidebar } from "@/components/home/LeftSidebar";
import { RightSidebar } from "@/components/home/RightSidebar";
import { Feed } from "@/components/feed/Feed";

export default function Home() {
  const { user, login, token, hasHydrated } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      router.push("/get-started");
    } else {
      authService
        .getMe()
        .then((freshUser: User) => {
          if (token && JSON.stringify(freshUser) !== JSON.stringify(user)) {
            login(freshUser, token);
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to fetch user profile:", error);
        });
    }
  }, [user, router, login, token, hasHydrated]);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="w-full px-4 pt-6 sm:px-6 md:px-8 lg:px-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] md:col-span-3 md:block">
            <LeftSidebar />
          </aside>

          <main className="col-span-1 md:col-span-9 lg:col-span-6">
            <Feed />
          </main>

          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] lg:col-span-3 lg:block">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
