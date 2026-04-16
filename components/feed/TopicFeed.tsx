"use client";

import { useEffect, useState } from "react";
import { postService, Post } from "@/lib/services/post-service";
import { PostCard } from "./PostCard";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TopicFeedProps {
  keyword: string;
  district: string;
}

export function TopicFeed({ keyword, district }: TopicFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword || !district) return;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await postService.searchPosts(district, keyword);
        if (res.status === "ok" && res.data) {
          setPosts(res.data);
        } else {
          setError("Failed to load posts.");
        }
      } catch {
        setError("Something went wrong while fetching posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [keyword, district]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Finding posts about &quot;{keyword}&quot;…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="bg-muted/50 rounded-full p-6">
          <SearchX className="text-muted-foreground h-10 w-10" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold">No posts found</h3>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            Nobody in <span className="font-medium">{district}</span> has posted
            about &quot;<span className="font-medium capitalize">{keyword}</span>&quot; yet.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">Back to home feed</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.postId ?? post.id} post={post} />
      ))}
    </div>
  );
}
