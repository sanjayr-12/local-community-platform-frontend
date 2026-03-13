import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@/lib/services/post-service";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";

interface PostCardProps {
  post: Post;
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

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="bg-muted/40 border-border hover:bg-muted/60 flex w-full flex-col gap-4 p-4 shadow-sm transition-colors duration-200">
      <div className="flex flex-col gap-3">
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

          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
            {post.district && (
              <div className="bg-muted/50 flex items-center gap-1 rounded-md px-2 py-1">
                <MapPin className="text-primary h-3 w-3" />
                <span>{post.district}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {post.imageUrl && (
          <div className="border-muted-foreground/20 relative mt-2 w-full overflow-hidden rounded-xl border">
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
      </div>
    </Card>
  );
}
