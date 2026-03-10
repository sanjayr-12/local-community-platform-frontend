import { axiosInstance } from "@/lib/api/axios-client";

export interface CreatePostPayload {
  content: string;
  image_url: string;
  lat: string;
  long: string;
}

export interface CreatePostResponse {
  status: string;
  message: string;
}

export const postService = {
  async createPost(payload: CreatePostPayload): Promise<CreatePostResponse> {
    const response = await axiosInstance.post<CreatePostResponse>(
      "/api/user/post",
      payload,
    );
    return response.data;
  },
};
