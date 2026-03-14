"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { LeftSidebar } from "@/components/home/LeftSidebar";
import { RightSidebar } from "@/components/home/RightSidebar";
import { SavedPostsFeed } from "@/components/feed/SavedPostsFeed";

export default function SavedPostsPage() {
  const { user, hasHydrated } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.push("/get-started");
    }
  }, [hasHydrated, user, router]);

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
            <SavedPostsFeed />
          </main>

          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] lg:col-span-3 lg:block">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
