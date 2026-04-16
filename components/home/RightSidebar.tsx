"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { TrendingUp, Loader2, Hash } from "lucide-react";
import { useLocation } from "@/lib/hooks/useLocation";
import { postService } from "@/lib/services/post-service";
import { useEffect, useState } from "react";
import Link from "next/link";

interface TrendingData {
  district: string;
  keywords: string[];
  computed_at: string | null;
}

export function RightSidebar() {
  const user = useAuthStore((state) => state.user);
  const { lat, long } = useLocation();

  const [trending, setTrending] = useState<TrendingData | null>(null);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [district, setDistrict] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !long) return;

    const fetchTrending = async () => {
      setIsLoadingTrending(true);
      try {
        // We get district from the feed (state_district_tag), but we can derive
        // it from the user's location using the same Nominatim reverse geocoding.
        // As a practical shortcut we call getPosts (which resolves district) —
        // instead, we expose the Nominatim call via a simpler approach:
        // use the user's last-known district stored in post responses.
        // For now, if the user has posts, grab district from state; otherwise
        // fall back to a direct Nominatim fetch.
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&accept-language=en`,
        );
        const data = await res.json();
        const district = data?.address?.state_district;
        if (!district) return;
        setDistrict(district);

        const trendingRes = await postService.getTrending(district);
        if (trendingRes.status === "ok" && trendingRes.data) {
          setTrending(trendingRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchTrending();
  }, [lat, long]);

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Profile card */}
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
          <div className="mt-12 space-y-3">
            <div>
              <h3 className="text-lg leading-none font-bold">{user?.name}</h3>
              <p className="text-muted-foreground text-sm">@{user?.username}</p>
            </div>

            {user?.bio && (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {user.bio}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-xs font-medium">
              <span className="text-foreground">
                {user?.totalNumOfPosts || 0}
              </span>
              <span className="text-muted-foreground">posts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending card */}
      <Card className="bg-muted/40 border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="text-primary h-4 w-4" />
            Trending in your area
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {isLoadingTrending ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            </div>
          ) : trending && trending.keywords.length > 0 ? (
            <>
              {trending.keywords.map((keyword, i) => (
                <Link
                  key={keyword}
                  href={`/topic/${encodeURIComponent(keyword)}${district ? `?district=${encodeURIComponent(district)}` : ""}`}
                  className="group flex items-center gap-2.5 rounded-lg px-1 py-0.5 -mx-1 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <span className="text-muted-foreground/50 text-xs w-4 text-right shrink-0">
                    {i + 1}
                  </span>
                  <div className="bg-primary/10 rounded-md p-1.5 shrink-0">
                    <Hash className="text-primary h-3 w-3" />
                  </div>
                  <p className="group-hover:text-primary text-sm font-medium capitalize transition-colors leading-none">
                    {keyword}
                  </p>
                </Link>
              ))}
              {trending.district && (
                <p className="text-muted-foreground/60 text-xs pt-1">
                  Based on posts in {trending.district} · last 24h
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-4">
              {lat
                ? "No trending topics yet. Post something!"
                : "Waiting for location…"}
            </p>
          )}
        </CardContent>
      </Card>

      <footer className="text-muted-foreground px-4 text-center text-xs">
        <p>© 2026 LocalConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}
