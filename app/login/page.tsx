"use client";

import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);
  const router = useRouter();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (credentialResponse.credential) {
      setLoading(true);
      try {
        const data = await AuthService.loginWithGoogle(
          credentialResponse.credential,
        );
        login(data.user, data.token);
        router.push("/");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleError = () => {
    console.error("Values");
  };

  const { resolvedTheme } = useTheme();

  return (
    <div className="bg-background flex h-screen w-full items-center justify-center px-4">
      <Card className="border-border bg-card w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your local community platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            useOneTap
            onError={handleGoogleError}
            shape="rectangular"
            theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
            size="large"
            width="100%"
          />
        </CardContent>
      </Card>
    </div>
  );
}
