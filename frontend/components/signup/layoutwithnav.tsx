"use client"; // Make sure this component runs on the client

import { usePathname } from 'next/navigation'; // For getting the current path
import { useEffect, useState } from 'react';
import { NavBar } from "@/components/navbar";

const LayoutWithNav = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Get the current path
  const [showNavbar, setShowNavbar] = useState<boolean | null>(null); // Initialize with `null` to delay rendering

  useEffect(() => {
    // Hide the NavBar on the register page
    if (pathname === "/signup") {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [pathname]);

  // Render nothing until `showNavbar` is set by useEffect
  if (showNavbar === null) {
    return null;
  }

  return (
    <div>
      {showNavbar && <NavBar />}
      {children}
    </div>
  );
};

export default LayoutWithNav;
