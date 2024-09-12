'use client'

import * as React from "react";
import Link from "next/link";
import { Bell, LogIn, MenuIcon, UserPlus, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ModeToggle from "@/components/mode-toggle";
import Search from "@/components/ui/search";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import LoginDialog from "./ui/logindialog";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';


export function NavBar() {
  // Manage the state for the login dialog
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    // Use URLSearchParams to parse the query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const loginQuery = searchParams.get('login'); // Get the "login" query parameter

    if (loginQuery === 'true') {
      setIsDialogOpen(true); // Open the login dialog if ?login=true is present
    }
  }, []);

  return (
    <div className="flex items-center w-full fixed justify-center p-2 z-[40] mt-[1rem] font-lato">
      <div className="flex justify-between md:w-[720px] w-[95%] border dark:border-zinc-900 dark:bg-black bg-opacity-10 relative backdrop-filter backdrop-blur-lg bg-white border-white border-opacity-20 rounded-xl p-2 shadow-lg">
        {/* Navigation Menu (Desktop) */}
        <NavigationMenu>
          <NavigationMenuList className="max-[825px]:hidden">
            <Link href="/" className="pl-2">
              <h1 className="font-bold">Rabbit.</h1>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Section: Search, Notifications, Account */}
        <div className="flex items-center gap-4 max-[825px]:hidden">
          <Link href="">
            <Search />
          </Link>
          <Link href="/automation">
            <Bell className="hover:text-gray-500 transition-all duration-200 ease-in-out" />
          </Link>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="hover:text-gray-500 transition-all duration-200 ease-in-out">
                <AvatarImage src="" />
                <AvatarFallback>
                  <UserRound />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-4 font-head text-text">
              <DropdownMenuLabel className="font-head">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* Login Trigger */}
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </DropdownMenuItem>

                {/* Signup Link */}
                <a href="/signup">
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Signup</span>
                  </DropdownMenuItem>
                </a>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Login Dialog */}
          <LoginDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
      </div>
    </div>
  );
}
