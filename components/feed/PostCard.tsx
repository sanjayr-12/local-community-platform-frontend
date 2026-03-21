"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post, postService } from "@/lib/services/post-service";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Bookmark,
  Heart,
  MessageCircle,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "./CommentSection";

interface PostCardProps {
  post: Post;
  showSaveIcon?: boolean;
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds || 0}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
}

export function PostCard({ post, showSaveIcon = true }: PostCardProps) {
  const { toast } = useToast();
  const currentPostId = post.postId || post.id;
  const currentDistrict = post.district || post.districtTag;

  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [isLiking, setIsLiking] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const commentCount = post.commentCount ?? 0;
  const viewCount = post.viewCount ?? 0;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaving || !currentPostId) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        const res = await postService.unsavePost(currentPostId);
        if (res.status === "ok") {
          setIsSaved(false);
          toast({ title: "Post removed", description: "Removed from saved items." });
        }
      } else {
        const res = await postService.savePost(currentPostId);
        if (res.status === "ok") {
          setIsSaved(true);
          toast({ title: "Post saved", description: "You can find it in Saved Posts." });
        }
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isSaved ? "unsave" : "save"} the post.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking || !currentPostId) return;

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    setIsLiking(true);

    try {
      if (wasLiked) {
        await postService.unlikePost(currentPostId);
      } else {
        await postService.likePost(currentPostId);
      }
    } catch {
      // Revert on failure
      setIsLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update like. Try again.",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="bg-muted/40 border-border hover:bg-muted/60 flex w-full flex-col gap-3 p-4 shadow-sm transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={post.picture} />
            <AvatarFallback>{post.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm leading-none font-semibold">
              {post.name}
            </span>
            <span className="text-muted-foreground mt-1 text-xs">
              @{post.username}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
            {currentDistrict && (
              <div className="bg-muted/50 flex items-center gap-1 rounded-md px-2 py-1">
                <MapPin className="text-primary h-3 w-3" />
                <span>{currentDistrict}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(post.createdAt)}</span>
            </div>
          </div>
          {showSaveIcon && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full cursor-pointer",
                isSaved ? "text-primary" : "text-muted-foreground",
              )}
              onClick={handleSave}
              disabled={isSaving}
            >
              <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
              <span className="sr-only">Save post</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="border-muted-foreground/20 relative mt-1 w-full overflow-hidden rounded-xl border">
          <Image
            src={post.imageUrl}
            alt="Post attachment"
            width={800}
            height={400}
            className="h-auto max-h-125 w-full object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Action bar */}
      <Separator className="mt-1" />
      <div className="flex items-center gap-1 -mb-1">
        {/* Like */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1.5 rounded-full px-3 text-xs cursor-pointer",
            isLiked
              ? "text-rose-500"
              : "text-muted-foreground hover:text-rose-500",
          )}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
          {likeCount > 0 && <span>{likeCount}</span>}
          <span className="hidden sm:inline">Like</span>
        </Button>

        {/* Comment */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1.5 rounded-full px-3 text-xs cursor-pointer",
            showComments
              ? "text-primary"
              : "text-muted-foreground hover:text-primary",
          )}
          onClick={() => setShowComments((v) => !v)}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {commentCount > 0 && <span>{commentCount}</span>}
          <span className="hidden sm:inline">Comment</span>
        </Button>

        {/* Views (read-only) */}
        {viewCount > 0 && (
          <div className="ml-auto flex items-center gap-1 text-muted-foreground text-xs px-2">
            <Eye className="h-3.5 w-3.5" />
            <span>{viewCount}</span>
          </div>
        )}
      </div>

      {/* Inline comment section */}
      {showComments && currentPostId && (
        <>
          <Separator />
          <CommentSection postId={currentPostId} />
        </>
      )}
    </Card>
  );
}
