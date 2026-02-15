import { axiosInstance } from "@/lib/api/axios-client";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  token: string;
}

export const AuthService = {
  async loginWithGoogle(credential: string): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      "/api/user/google",
      {
        token: credential,
      },
    );
    return response.data;
  },

  logout() {},
};
