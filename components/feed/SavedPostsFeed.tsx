"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  AlertTriangle,
  Bookmark,
} from "lucide-react";
import { postService, Post } from "@/lib/services/post-service";
import { PostCard } from "./PostCard";

export function SavedPostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postsFetchError, setPostsFetchError] = useState<string | null>(null);

  const fetchSavedPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    setPostsFetchError(null);
    try {
      const res = await postService.getSavedPosts();
      if (res.status === "ok" && res.data) {
        setPosts(res.data);
      } else {
        setPostsFetchError(res.message || "Failed to fetch saved posts.");
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      setPostsFetchError("Something went wrong while fetching saved posts.");
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  return (
    <div className="flex w-full flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Saved Posts</h1>
      </div>

      <Separator />

      {isLoadingPosts ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">Loading saved posts...</p>
        </div>
      ) : postsFetchError ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
          <div className="bg-destructive/10 rounded-full p-6">
            <AlertTriangle className="text-destructive h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Failed to load posts</h3>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm">
              {postsFetchError}
            </p>
          </div>
          <Button variant="outline" onClick={fetchSavedPosts} className="mt-4">
            Try again
          </Button>
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.postId || post.id}
              post={post}
              showSaveIcon={false}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
          <div className="bg-muted/50 rounded-full p-6">
            <Bookmark className="text-muted-foreground h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">No saved posts</h3>
            <p className="text-muted-foreground mx-auto max-w-sm">
              Posts you save will appear here for easy access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
