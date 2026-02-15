"use client";

import Link from "next/link";
import { Users, Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/home/LeftSidebar";

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-14 w-full items-center gap-4 px-4 sm:px-6 md:h-16 md:px-8 lg:px-24">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70 p-0">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <div className="p-6">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Users className="text-primary h-6 w-6" />
                  <span>LocalConnect</span>
                </div>
              </div>
              <LeftSidebar mobile />
            </SheetContent>
          </Sheet>
        </div>

        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Users className="text-primary h-6 w-6" />
            <span>LocalConnect</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center space-x-2 md:justify-center">
          <div className="text-muted-foreground relative w-full max-w-xl">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search posts, events, or people..."
              className="bg-muted w-full rounded-full pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.picture} alt={user?.name} />
                  <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {user?.name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 hover:text-red-600"
                onClick={() => {
                  logout();
                  window.location.href = "/get-started";
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
