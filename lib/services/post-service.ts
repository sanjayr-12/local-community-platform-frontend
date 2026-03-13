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
  postId: number;
  content: string;
  imageUrl: string | null;
  district: string;
  publicId: string | null;
  createdAt: string;
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

export const postService = {
  async getPosts(lat: number | string, long: number | string): Promise<GetPostsResponse> {
    const response = await axiosInstance.get<GetPostsResponse>(
      `/api/post?lat=${lat}&long=${long}`
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
