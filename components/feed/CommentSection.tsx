"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { Comment, postService } from "@/lib/services/post-service";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const user = useAuthStore((state) => state.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [content, setContent] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Fetch comments when section mounts
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const res = await postService.getComments(postId);
        if (res.status === "ok" && res.data) {
          setComments(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };

    if (!hasFetched) {
      fetchComments();
    }
  }, [postId, hasFetched]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await postService.addComment(postId, content.trim());
      if (res.status === "ok" && res.data) {
        setComments((prev) => [...prev, res.data!]);
      }
      setContent("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-1">
      {/* Comment input */}
      <div className="flex items-start gap-2">
        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
          <AvatarImage src={user?.picture} />
          <AvatarFallback className="text-xs">{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 items-end gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Write a comment… (Enter to send)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="bg-background min-h-8 resize-none rounded-2xl border px-3 py-1.5 text-sm focus-visible:ring-1 leading-snug"
            maxLength={500}
          />
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 shrink-0 rounded-full",
              content.trim() ? "text-primary" : "text-muted-foreground",
            )}
            disabled={!content.trim() || isSending}
            onClick={() => handleSubmit()}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-3">
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        </div>
      ) : comments.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex items-start gap-2.5">
              <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                <AvatarImage src={comment.picture} />
                <AvatarFallback className="text-xs">
                  {comment.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-3 py-1.5 flex-1">
                <span className="text-xs font-semibold leading-tight">
                  {comment.name}
                </span>
                <p className="text-sm leading-snug mt-0.5">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        hasFetched && (
          <p className="text-muted-foreground text-xs text-center py-1">
            No comments yet. Be the first!
          </p>
        )
      )}
    </div>
  );
}
