"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Calendar, Heart, Menu } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/store/useAuthStore";

export default function GetStartedPage() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const login = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);
  const router = useRouter();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (credentialResponse.credential) {
      setLoading(true);
      try {
        const data = await authService.loginWithGoogle(
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

  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden">
      <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 md:h-16 md:px-8 lg:px-24">
          <div className="flex shrink-0 items-center gap-2 text-lg font-bold md:text-xl">
            <Users className="text-primary h-5 w-5 md:h-6 md:w-6" />
            <span className="text-base md:text-xl">LocalConnect</span>
          </div>
          <nav className="flex items-center gap-3 sm:gap-6 md:gap-8">
            <div className="hidden items-center gap-6 md:flex lg:gap-8">
              <Link
                className="text-sm font-medium underline-offset-4 transition-colors hover:underline"
                href="#"
              >
                Features
              </Link>
              <Link
                className="text-sm font-medium underline-offset-4 transition-colors hover:underline"
                href="#"
              >
                About
              </Link>
              <Link
                className="text-sm font-medium underline-offset-4 transition-colors hover:underline"
                href="#"
              >
                Contact
              </Link>
            </div>
            <ModeToggle />
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader className="text-left">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-4 px-4">
                    <Link
                      className="text-lg font-medium underline-offset-4 transition-colors hover:underline"
                      href="#"
                    >
                      Features
                    </Link>
                    <Link
                      className="text-lg font-medium underline-offset-4 transition-colors hover:underline"
                      href="#"
                    >
                      About
                    </Link>
                    <Link
                      className="text-lg font-medium underline-offset-4 transition-colors hover:underline"
                      href="#"
                    >
                      Contact
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col items-center justify-center p-4 py-8 md:py-20">
        <section className="mb-16 flex w-full max-w-6xl flex-col items-center space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="from-primary bg-linear-to-r to-blue-600 bg-clip-text px-2 text-3xl font-extrabold tracking-tight wrap-break-word text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
              Your Community, Connected.
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
              Join a vibrant network of neighbors. Discover events and build
              stronger local connections.
            </p>
          </div>

          <div
            className="flex justify-center pt-4"
            style={{ minHeight: "80px" }}
          >
            {!isLoginVisible ? (
              <Button
                size="lg"
                className="cursor-pointer rounded-full px-10 py-6 text-base shadow-lg transition-all hover:shadow-xl"
                onClick={async () => {
                  const token = useAuthStore.getState().token;
                  if (token) {
                    setLoading(true);
                    try {
                      await authService.getMe();
                      router.push("/");
                    } catch (error) {
                      console.error("Token invalid/expired:", error);
                      setIsLoginVisible(true);
                    } finally {
                      setLoading(false);
                    }
                  } else {
                    setIsLoginVisible(true);
                  }
                }}
              >
                Get Started
              </Button>
            ) : (
              <div className="animate-in fade-in zoom-in duration-300">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  use_fedcm_for_prompt={false}
                  shape="pill"
                  theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
                  size="large"
                />
              </div>
            )}
          </div>
        </section>

        <section className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <Card className="bg-muted/30 hover:border-primary/20 border shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start gap-4 p-6">
              <div className="bg-primary/10 rounded-lg p-3">
                <MapPin className="text-primary h-6 w-6" />
              </div>
              <div className="grid gap-2">
                <CardTitle className="text-lg">Location Aware</CardTitle>
                <p className="text-muted-foreground text-sm">
                  See content relevant to your specific neighborhood.
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-muted/30 border shadow-sm transition-all hover:border-green-600/20 hover:shadow-md">
            <CardHeader className="flex flex-row items-start gap-4 p-6">
              <div className="rounded-lg bg-green-600/10 p-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="grid gap-2">
                <CardTitle className="text-lg">Local Events</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Discover what&apos;s happening around you.
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-muted/30 border shadow-sm transition-all hover:border-red-500/20 hover:shadow-md">
            <CardHeader className="flex flex-row items-start gap-4 p-6">
              <div className="rounded-lg bg-red-500/10 p-3">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div className="grid gap-2">
                <CardTitle className="text-lg">Community First</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Foster genuine connections and support.
                </p>
              </div>
            </CardHeader>
          </Card>
        </section>
      </main>

      <footer className="text-muted-foreground mt-auto w-full border-t py-6 text-center text-xs">
        <p>
          © {new Date().getFullYear()} Local Community Platform. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
