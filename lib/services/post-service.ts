/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/lib/api/axios-client";

export interface CreatePostPayload {
  content: string;
  imageUrl?: string;
  publicId?: string;
  lat: string;
  long: string;
}

export interface CreatePostResponse {
  status: string;
  message: string;
}

export interface UploadImageResponse {
  status: string;
  data: {
    url: string;
    publicId: string;
  };
}

export interface Post {
  postId?: number;
  id?: number;
  content: string;
  imageUrl: string | null;
  district?: string;
  districtTag?: string;
  publicId?: string | null;
  createdAt: string;
  userId?: number;
  name: string;
  username: string;
  picture: string;
  isSaved?: boolean;
  isLiked?: boolean;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
}

export interface Comment {
  commentId: number;
  postId: number;
  content: string;
  userId: number;
  name: string;
  username: string;
  picture: string;
}

export interface GetPostsResponse {
  status: string;
  data?: Post[];
  message?: string;
}

export interface GetCommentsResponse {
  status: string;
  data?: Comment[];
  message?: string;
}

export interface TrendingResponse {
  status: string;
  data?: {
    district: string;
    keywords: string[];
    computed_at: string | null;
  };
  message?: string;
}

export const postService = {
  async getPosts(
    lat: number | string,
    long: number | string,
  ): Promise<GetPostsResponse> {
    const response = await axiosInstance.get<GetPostsResponse>(
      `/api/post?lat=${lat}&long=${long}`,
    );
    return response.data;
  },

  async getMyPosts(): Promise<GetPostsResponse> {
    const response = await axiosInstance.get<GetPostsResponse>("/api/post/my");
    return response.data;
  },

  async getSavedPosts(): Promise<GetPostsResponse> {
    const response = await axiosInstance.get<GetPostsResponse>(
      "/api/post/save",
    );
    return response.data;
  },

  async savePost(postId: number): Promise<{ status: string; data?: any }> {
    const response = await axiosInstance.post("/api/post/save", { postId });
    return response.data;
  },

  async unsavePost(postId: number): Promise<{ status: string; data?: any }> {
    const response = await axiosInstance.delete(`/api/post/save/${postId}`);
    return response.data;
  },

  async likePost(postId: number): Promise<{ status: string }> {
    const response = await axiosInstance.post("/api/like", { postId });
    return response.data;
  },

  async unlikePost(postId: number): Promise<{ status: string }> {
    const response = await axiosInstance.delete(`/api/like/${postId}`);
    return response.data;
  },

  async getComments(postId: number): Promise<GetCommentsResponse> {
    const response = await axiosInstance.get<GetCommentsResponse>(
      `/api/comment/${postId}`,
    );
    return response.data;
  },

  async addComment(
    postId: number,
    content: string,
  ): Promise<{ status: string; data?: Comment }> {
    const response = await axiosInstance.post(`/api/comment/${postId}`, {
      content,
    });
    return response.data;
  },

  async getTrending(district: string): Promise<TrendingResponse> {
    const response = await axiosInstance.get<TrendingResponse>(
      `/api/post/trending?district=${encodeURIComponent(district)}`,
    );
    return response.data;
  },

  async searchPosts(
    district: string,
    keyword: string,
  ): Promise<GetPostsResponse> {
    const response = await axiosInstance.get<GetPostsResponse>(
      `/api/post/search?district=${encodeURIComponent(district)}&keyword=${encodeURIComponent(keyword)}`,
    );
    return response.data;
  },

  async createPost(payload: CreatePostPayload): Promise<CreatePostResponse> {
    const response = await axiosInstance.post<CreatePostResponse>(
      "/api/post",
      payload,
    );
    return response.data;
  },

  async uploadPostImage(base64: string): Promise<UploadImageResponse> {
    const response = await axiosInstance.post<UploadImageResponse>(
      "/api/post/upload",
      { base64 },
    );
    return response.data;
  },
};

