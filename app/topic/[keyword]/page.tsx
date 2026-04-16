"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LeftSidebar } from "@/components/home/LeftSidebar";
import { RightSidebar } from "@/components/home/RightSidebar";
import { TopicFeed } from "@/components/feed/TopicFeed";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hash, MapPin } from "lucide-react";
import Link from "next/link";

interface TopicPageProps {
  params: Promise<{ keyword: string }>;
}

export default function TopicPage({ params }: TopicPageProps) {
  const { keyword } = use(params);
  const searchParams = useSearchParams();
  const district = searchParams.get("district") ?? "";

  const decodedKeyword = decodeURIComponent(keyword);
  const decodedDistrict = decodeURIComponent(district);

  const { user, hasHydrated } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.push("/get-started");
    }
  }, [hasHydrated, user, router]);

  if (!user) return null;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="w-full px-4 pt-6 sm:px-6 md:px-8 lg:px-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
          {/* Left Sidebar */}
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] md:col-span-3 md:block">
            <LeftSidebar />
          </aside>

          {/* Main content */}
          <main className="col-span-1 md:col-span-9 lg:col-span-6">
            <div className="flex w-full flex-col gap-6 py-4">
              {/* Topic Header */}
              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-fit gap-2 -ml-2 text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    Back to feed
                  </Link>
                </Button>

                <div className="bg-muted/40 rounded-2xl border border-transparent p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-xl p-3 shrink-0 mt-0.5">
                      <Hash className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h1 className="text-2xl font-bold capitalize leading-tight">
                        {decodedKeyword}
                      </h1>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        {decodedDistrict && (
                          <>
                            <MapPin className="h-3.5 w-3.5 text-green-500 shrink-0" />
                            <span>
                              Posts in{" "}
                              <span className="font-medium text-foreground">
                                {decodedDistrict}
                              </span>{" "}
                              · Trending topic
                            </span>
                          </>
                        )}
                        {!decodedDistrict && (
                          <span>Trending topic</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Feed */}
              {decodedDistrict ? (
                <TopicFeed keyword={decodedKeyword} district={decodedDistrict} />
              ) : (
                <div className="text-muted-foreground text-center py-16 text-sm">
                  <p>Missing district info. Please go back and click the keyword again.</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/">Go home</Link>
                  </Button>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] lg:col-span-3 lg:block">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
