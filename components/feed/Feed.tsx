"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Image as ImageIcon,
  X,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore, type User } from "@/store/useAuthStore";
import { useLocation } from "@/lib/hooks/useLocation";
import { postService, Post } from "@/lib/services/post-service";
import Image from "next/image";
import { PostCard } from "./PostCard";
import { useToast } from "@/lib/hooks/use-toast";

interface CreatePostComponentProps {
  user: User | null;
  content: string;
  setContent: (content: string) => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
  handleDrop: (e: React.DragEvent) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  isUploadingImage: boolean;
  imageUrl: string | null;
  removeImage: () => void;
  postSuccess: string | null;
  setPostSuccess: (success: string | null) => void;
  postError: string | null;
  setPostError: (error: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageFile: (file: File) => void;
  isPosting: boolean;
  handlePost: () => void;
  isMobileCreateView: boolean;
}

const CreatePostComponent = ({
  user,
  content,
  setContent,
  isDragOver,
  setIsDragOver,
  handleDrop,
  handlePaste,
  isUploadingImage,
  imageUrl,
  removeImage,
  postSuccess,
  setPostSuccess,
  postError,
  setPostError,
  fileInputRef,
  handleImageFile,
  isPosting,
  handlePost,
  isMobileCreateView,
}: CreatePostComponentProps) => (
  <Card
    className={`bg-muted/40 border ${isDragOver ? "border-primary" : "border-transparent"} p-4 shadow-sm transition-colors duration-200`}
    onDragOver={(e) => {
      e.preventDefault();
      setIsDragOver(true);
    }}
    onDragLeave={(e) => {
      e.preventDefault();
      setIsDragOver(false);
    }}
    onDrop={handleDrop}
  >
    <div className="flex gap-4">
      <Avatar className="mt-1 shrink-0">
        <AvatarImage src={user?.picture} />
        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-3">
        <Textarea
          placeholder="What's happening in your community?"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setPostSuccess(null);
            setPostError(null);
          }}
          onPaste={handlePaste}
          className="bg-background min-h-20 resize-none rounded-2xl border px-4 py-3 text-sm focus-visible:ring-1"
          maxLength={500}
          autoFocus={isMobileCreateView}
        />

        {(isUploadingImage || imageUrl) && (
          <div className="bg-muted/20 relative mt-2 w-full max-w-md overflow-hidden rounded-xl border pb-[56.25%]">
            {isUploadingImage ? (
              <div className="bg-background/50 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                <div className="text-primary flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-xs font-medium">
                    Uploading image...
                  </span>
                </div>
              </div>
            ) : imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt="Post attachment"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : null}
          </div>
        )}

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
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5 text-green-500" />
              <span className="hidden sm:inline">Location detected</span>
            </div>

            <Separator orientation="vertical" className="h-4" />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary h-8 cursor-pointer gap-1.5 px-2 text-xs"
              disabled={isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Image</span>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs">
              {content.length}/500
            </span>
            <Button
              size="sm"
              className="cursor-pointer rounded-full px-6"
              disabled={
                (!content.trim() && !imageUrl) ||
                isPosting ||
                isUploadingImage
              }
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
);

export function Feed() {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const { lat, long, status, error, reason, requestLocation } = useLocation();

  const [isMobileCreateView, setIsMobileCreateView] = useState(false);

  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postsFetchError, setPostsFetchError] = useState<string | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    if (!lat || !long) return;
    setIsLoadingPosts(true);
    setPostsFetchError(null);
    try {
      const res = await postService.getPosts(lat, long);
      if (res.status === "ok" && res.data) {
        setPosts(res.data);
      } else {
        setPostsFetchError("Failed to fetch posts.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPostsFetchError("Something went wrong while fetching posts.");
    } finally {
      setIsLoadingPosts(false);
    }
  }, [lat, long]);

  useEffect(() => {
    if (status === "granted" || (lat && long)) {
      fetchPosts();
    }
  }, [lat, long, status, fetchPosts]);

  const handlePost = async () => {
    const currentLat = lat;
    const currentLong = long;
    if (!content.trim() || !currentLat || !currentLong || isUploadingImage)
      return;

    setIsPosting(true);
    setPostSuccess(null);
    setPostError(null);

    try {
      await postService.createPost({
        content: content.trim(),
        ...(imageUrl && { imageUrl }),
        ...(publicId && { publicId }),
        lat: currentLat,
        long: currentLong,
      });
      setPostSuccess("Post created!");
      toast({
        title: "Success",
        description: "Your post has been shared with the community.",
      });
      setContent("");
      setImageUrl(null);
      setPublicId(null);
      setIsMobileCreateView(false);
      fetchPosts();
    } catch (err) {
      // Show the real API error (e.g. moderation rejection) if available
      const apiMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setPostError(apiMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: apiMessage,
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setPostError("Please upload a valid image file.");
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select an image file.",
      });
      return;
    }

    setIsUploadingImage(true);
    setPostError(null);
    toast({
      title: "Uploading image...",
      description: "Please wait while we process your image.",
    });

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const res = await postService.uploadPostImage(base64String);

        if (res.status === "ok" || res.data?.url) {
          setImageUrl(res.data.url);
          setPublicId(res.data.publicId);
          toast({
            title: "Image uploaded",
            description: "Your image is ready to be posted.",
          });
        } else {
          setPostError("Failed to upload image. Please try again.");
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: "Could not upload the image. Please try again.",
          });
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        setPostError("Failed to upload image. Please try again.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong during upload.",
        });
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleImageFile(file);
          break;
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setPublicId(null);
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

  if (status === "denied" || status === "unsupported") {
    const isInsecureContext = reason === "insecure-context";
    const title =
      status === "unsupported"
        ? "Location Not Supported"
        : isInsecureContext
          ? "Secure Connection Required"
          : "Location Access Required";
    const helperText =
      error ??
      "This app shows posts from people near you. Enable location access and try again.";
    const tipText =
      isInsecureContext
        ? "On phones, http:// local-network URLs will not trigger the browser location prompt. Use HTTPS to test location access."
        : "Open your browser's site settings and allow location access for this app.";

    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <div className="rounded-full bg-amber-500/10 p-6">
          <MapPin className="h-10 w-10 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
            {helperText}
          </p>
        </div>
        {status !== "unsupported" && !isInsecureContext && (
          <Button className="rounded-full px-6" onClick={requestLocation}>
            Try Again
          </Button>
        )}
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-600">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{tipText}</span>
        </div>
      </div>
    );
  }

  if (isMobileCreateView) {
    return (
      <div className="flex w-full flex-col gap-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            onClick={() => setIsMobileCreateView(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold flex-1">Create Post</h2>
        </div>
        <CreatePostComponent
          user={user}
          content={content}
          setContent={setContent}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          handleDrop={handleDrop}
          handlePaste={handlePaste}
          isUploadingImage={isUploadingImage}
          imageUrl={imageUrl}
          removeImage={removeImage}
          postSuccess={postSuccess}
          setPostSuccess={setPostSuccess}
          postError={postError}
          setPostError={setPostError}
          fileInputRef={fileInputRef}
          handleImageFile={handleImageFile}
          isPosting={isPosting}
          handlePost={handlePost}
          isMobileCreateView={isMobileCreateView}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 py-4 relative">
      <div className="hidden md:block">
        <CreatePostComponent
          user={user}
          content={content}
          setContent={setContent}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          handleDrop={handleDrop}
          handlePaste={handlePaste}
          isUploadingImage={isUploadingImage}
          imageUrl={imageUrl}
          removeImage={removeImage}
          postSuccess={postSuccess}
          setPostSuccess={setPostSuccess}
          postError={postError}
          setPostError={setPostError}
          fileInputRef={fileInputRef}
          handleImageFile={handleImageFile}
          isPosting={isPosting}
          handlePost={handlePost}
          isMobileCreateView={isMobileCreateView}
        />
      </div>

      <Separator className="hidden md:block" />

      <div className="md:hidden flex justify-end sticky top-0 z-10 pt-2 pb-4 bg-background/80 backdrop-blur-md">
        <Button 
          onClick={() => setIsMobileCreateView(true)}
          className="rounded-full shadow-lg gap-2 pl-4 pr-5 h-11"
        >
          <Plus className="h-5 w-5" />
          Create Post
        </Button>
      </div>

      {isLoadingPosts ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">Loading community posts...</p>
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
          <Button variant="outline" onClick={fetchPosts} className="mt-4">
            Try again
          </Button>
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.postId || post.id} post={post} />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
