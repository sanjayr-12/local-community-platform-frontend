"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, FileText, Megaphone, Bookmark } from "lucide-react";

interface LeftSidebarProps {
  mobile?: boolean;
}

const sidebarItems = [
  { icon: Home, label: "Home Feed", href: "/" },
  { icon: FileText, label: "My Posts", href: "/my-posts" },
  { icon: Megaphone, label: "Announcements", href: "/announcements" },
  { icon: Bookmark, label: "Saved Posts", href: "/saved" },
];

export function LeftSidebar({ mobile }: LeftSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col gap-2", mobile ? "px-2" : "py-4")}>
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "h-12 w-full justify-start gap-4 text-base font-normal",
              isActive && "bg-secondary font-medium",
              !mobile && "hover:bg-muted/50",
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
