"use client";

import { useAuthStore, type User } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/lib/services/auth-service";

import { Navbar } from "@/components/layout/Navbar";
import { LeftSidebar } from "@/components/home/LeftSidebar";
import { RightSidebar } from "@/components/home/RightSidebar";
import { MyPostsFeed } from "@/components/feed/MyPostsFeed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mail, User as UserIcon, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { user, login, token, hasHydrated } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.push("/get-started");
    }
  }, [hasHydrated, user, router]);

  useEffect(() => {
    if (!hasHydrated || !user || !token) return;
    authService
      .getMe()
      .then((freshUser: User) => {
        if (JSON.stringify(freshUser) !== JSON.stringify(user)) {
          login(freshUser, token);
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch user profile:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  if (!user) {
    return null;
  }

  const formattedDate = new Date(user.createdat).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="w-full px-4 pt-6 sm:px-6 md:px-8 lg:px-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] md:col-span-3 md:block">
            <LeftSidebar />
          </aside>

          <main className="col-span-1 md:col-span-9 lg:col-span-6">
            <div className="flex flex-col gap-6 py-4">
              <Card className="bg-muted/40 overflow-hidden border-none shadow-sm">
                <div className="bg-primary/10 h-32 w-full" />
                <CardContent className="relative px-6 pt-0 pb-6">
                  <div className="absolute -top-12 left-6">
                    <Avatar className="border-background h-24 w-24 border-4 shadow-sm">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {user.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-14 flex flex-col gap-4">
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-bold tracking-tight">
                        {user.name}
                      </h1>
                      <p className="text-muted-foreground">@{user.username}</p>
                    </div>

                    {user.bio && (
                      <p className="text-foreground text-sm whitespace-pre-wrap">
                        {user.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {formattedDate}</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>{user.totalNumOfPosts} posts</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="px-1">
                <MyPostsFeed />
              </div>
            </div>
          </main>

          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] lg:col-span-3 lg:block">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
