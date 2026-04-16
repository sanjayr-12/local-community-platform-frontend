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
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "./CommentSection";
import { useAuthStore } from "@/store/useAuthStore";

interface PostCardProps {
  post: Post;
  showSaveIcon?: boolean;
  onDeleted?: (postId: number) => void;
}

function formatTime(dateString: string) {
  let normalizedDate = dateString;
  if (!normalizedDate.includes("T")) normalizedDate = normalizedDate.replace(" ", "T");
  if (!normalizedDate.endsWith("Z")) normalizedDate += "Z";

  const date = new Date(normalizedDate);
  const now = new Date();
  // Math.max to prevent negative seconds if the post was created < 1 second ago
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
}

function renderContentWithLinks(content: string) {
  // Regex to match URLs (http or https)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline cursor-pointer font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export function PostCard({ post, showSaveIcon = true, onDeleted }: PostCardProps) {
  const { toast } = useToast();
  const currentUser = useAuthStore((state) => state.user);
  const currentPostId = post.postId || post.id;
  const currentDistrict = post.district || post.districtTag;

  const isOwner = currentUser?.id !== undefined && post.userId === currentUser.id;

  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [isLiking, setIsLiking] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDelete = async () => {
    if (!currentPostId || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await postService.deletePost(currentPostId);
      if (res.status === "ok") {
        setIsDeleted(true);
        toast({ title: "Post deleted", description: "Your post has been removed." });
        onDeleted?.(currentPostId);
      } else {
        toast({ variant: "destructive", title: "Error", description: res.message || "Failed to delete." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not delete the post." });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleted) return null;

  // Inline delete confirmation mode
  if (showDeleteConfirm) {
    return (
      <Card className="bg-destructive/10 border-destructive/20 flex w-full flex-col gap-4 p-5 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-foreground">Delete this post?</h3>
          <p className="text-muted-foreground text-sm mt-1">
            This will permanently delete the post and all its comments and likes. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 justify-end mt-2">
          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </Card>
    );
  }

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

          {/* Delete button — only for post owner */}
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive cursor-pointer"
              disabled={isDeleting}
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete post</span>
            </Button>
          )}

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
      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
        {renderContentWithLinks(post.content)}
      </p>

      {post.imageUrl && (        <div className="border-muted-foreground/20 relative mt-1 w-full overflow-hidden rounded-xl border">
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
