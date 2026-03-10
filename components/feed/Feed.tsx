"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  PenSquare,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocation } from "@/lib/hooks/useLocation";
import { postService } from "@/lib/services/post-service";

const DUMMY_IMAGE_URL = "https://placehold.co/800x400/png?text=Community+Post";

export function Feed() {
  const user = useAuthStore((state) => state.user);
  const { lat, long, status } = useLocation();

  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const handlePost = async () => {
    const currentLat = lat;
    const currentLong = long;
    if (!content.trim() || !currentLat || !currentLong) return;

    setIsPosting(true);
    setPostSuccess(null);
    setPostError(null);

    try {
      await postService.createPost({
        content: content.trim(),
        image_url: DUMMY_IMAGE_URL,
        lat: currentLat,
        long: currentLong,
      });
      setPostSuccess("Post created!");
      setContent("");
    } catch {
      setPostError("Something went wrong. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-24 text-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Detecting your location…
        </p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <div className="rounded-full bg-amber-500/10 p-6">
          <MapPin className="h-10 w-10 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Location Access Required</h3>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
            This app shows posts from people near you. Please enable location
            access in your browser settings and reload the page to continue.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-600">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>
            Tip: Click the lock icon in your address bar to manage permissions.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 py-4">
      <Card className="bg-muted/40 border-none p-4 shadow-sm">
        <div className="flex gap-4">
          <Avatar className="mt-1 shrink-0">
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-3">
            <Textarea
              placeholder="What's happening in your community?"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setContent(e.target.value);
                setPostSuccess(null);
                setPostError(null);
              }}
              className="bg-background min-h-20 resize-none rounded-2xl border px-4 py-3 text-sm focus-visible:ring-1"
              maxLength={500}
            />

            {postSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                {postSuccess}
              </div>
            )}
            {postError && (
              <div className="text-destructive bg-destructive/10 flex items-center gap-2 rounded-lg px-3 py-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {postError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5 text-green-500" />
                <span>Location detected</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-xs">
                  {content.length}/500
                </span>
                <Button
                  size="sm"
                  className="cursor-pointer rounded-full px-6"
                  disabled={!content.trim() || isPosting}
                  onClick={handlePost}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Posting…
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
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
            community!
          </p>
        </div>
      </div>
    </div>
  );
}
