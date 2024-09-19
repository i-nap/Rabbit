'use client';

import * as React from "react";
import Link from "next/link";
import { Bell, LogIn, UserPlus, UserRound, UserCircle } from "lucide-react";  // Import UserCircle for logged-in without profile pic
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import Search from "@/components/ui/search";
import LoginDialog from "./ui/logindialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";  // Import RootState from Redux store
import { logout } from "@/app/slices/userSlice";  // Import logout action

export function NavBar() {
  // Manage the state for the login dialog
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  // Use Redux to manage user login state
  const { isLoggedIn, userInfo } = useSelector((state: RootState) => state.user);
  console.log(userInfo);
  const dispatch = useDispatch();
  
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());  // Dispatch logout action
    localStorage.removeItem('jwt'); // Remove JWT token from localStorage
    localStorage.removeItem('user'); // Remove user info from localStorage
    router.push('/'); // Redirect to homepage after logout
  };

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

          {/* Show notification icon only when logged in */}
          {isLoggedIn && (
            <Link href="/automation">
              <Bell className="hover:text-gray-500 transition-all duration-200 ease-in-out" />
            </Link>
          )}

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="hover:text-gray-500 transition-all duration-200 ease-in-out">
                {isLoggedIn && userInfo?.profilePicture ? (
                  // Show profile picture when available
                  <AvatarImage src={userInfo.profilePicture} alt="Profile Picture" />
                ) : isLoggedIn ? (
                  // Show a different icon if logged in but no profile picture
                  <AvatarFallback>
                    <UserCircle />
                  </AvatarFallback>
                ) : (
                  // Show default icon when not logged in
                  <AvatarFallback>
                    <UserRound />
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-4 font-head text-text">
              <DropdownMenuLabel className="font-head">
                {isLoggedIn ? `Hello, ${userInfo?.username || 'User'}` : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push('/editprofile')}>
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </DropdownMenuItem>
                    <a href="/signup">
                      <DropdownMenuItem>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Signup</span>
                      </DropdownMenuItem>
                    </a>
                  </>
                )}
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
