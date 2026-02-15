import { axiosInstance } from "@/lib/api/axios-client";
import { User } from "@/store/useAuthStore";

export interface LoginResponse {
  status: string;
  data: {
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      picture?: string;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
}

export const AuthService = {
  async loginWithGoogle(
    credential: string,
  ): Promise<{ user: LoginResponse["data"]["user"]; token: string }> {
    const response = await axiosInstance.post<LoginResponse>(
      "/api/user/google",
      {
        token: credential,
      },
    );
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await axiosInstance.get<{ status: string; user: User[] }>(
      "/api/user/me",
    );
    return response.data.user[0];
  },

  logout() {},
};
