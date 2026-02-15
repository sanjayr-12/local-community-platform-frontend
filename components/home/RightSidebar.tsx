"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { TrendingUp, MapPin } from "lucide-react";

export function RightSidebar() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col gap-6 py-4">
      <Card className="bg-muted/40 overflow-hidden border-none shadow-sm">
        <div className="bg-primary/10 h-20 w-full" />
        <CardContent className="relative px-6 pt-0 pb-6">
          <div className="absolute -top-10 left-6">
            <Avatar className="border-background h-20 w-20 border-4 shadow-sm">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="text-xl">
                {user?.name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-12 space-y-2">
            <div>
              <h3 className="text-lg leading-none font-bold">{user?.name}</h3>
              <p className="text-muted-foreground text-sm">@{user?.username}</p>
            </div>

            <p className="text-muted-foreground line-clamp-2 text-sm">
              Community member. Passionate about local events and improvements.
            </p>

            <div className="text-muted-foreground flex items-center gap-2 pt-2 text-xs">
              <MapPin className="h-3 w-3" />
              <span>New York, NY</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/40 border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="text-primary h-4 w-4" />
            Trending in your area
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {[
            { tag: "CommunityGarden", count: "2.4k posts" },
            { tag: "LocalJazzFest", count: "1.2k posts" },
            { tag: "StreetRepair", count: "854 posts" },
            { tag: "Volunteer", count: "650 posts" },
          ].map((item) => (
            <div
              key={item.tag}
              className="group flex cursor-pointer items-center justify-between"
            >
              <div className="space-y-0.5">
                <p className="group-hover:text-primary text-sm font-medium transition-colors">
                  #{item.tag}
                </p>
                <p className="text-muted-foreground text-xs">{item.count}</p>
              </div>
            </div>
          ))}
          <Button
            variant="link"
            className="text-muted-foreground h-auto justify-start px-0 pt-2 text-xs"
          >
            Show more
          </Button>
        </CardContent>
      </Card>

      <footer className="text-muted-foreground px-4 text-center text-xs">
        <p>© 2026 LocalConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}
