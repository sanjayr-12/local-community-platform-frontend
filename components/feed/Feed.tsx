"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenSquare, Image as ImageIcon, Smile } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";

export function Feed() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex w-full flex-col gap-6 py-4">
      <Card className="bg-muted/40 border-none p-4 shadow-sm">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Button
              variant="ghost"
              className="text-muted-foreground bg-background hover:bg-background/80 h-10 w-full justify-start rounded-full border px-4"
            >
              What&apos;s happening in your community?
            </Button>
            <div className="mt-4 flex items-center justify-between pl-2">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground gap-2"
                >
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                  Media
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground gap-2"
                >
                  <Smile className="h-4 w-4 text-yellow-500" />
                  Activity
                </Button>
              </div>
              <Button size="sm" className="rounded-full px-6">
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Separator />

      <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
        <div className="bg-muted/50 rounded-full p-6">
          <PenSquare className="text-muted-foreground h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">No posts yet</h3>
          <p className="text-muted-foreground mx-auto max-w-sm">
            Your feed is empty. Be the first to share something with your
            community or follow topics to see more.
          </p>
        </div>
        <Button variant="outline" className="mt-4">
          Find Topics
        </Button>
      </div>
    </div>
  );
}
