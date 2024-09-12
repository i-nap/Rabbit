'use client'
// app/layout.tsx
import "./globals.css";
import LayoutWithNav from "../components/signup/layoutwithnav"; // Import your client-side component
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scrollbar-hide">
      <body className="bg-bg">
        {/* Use the client-side component here */}
        <LayoutWithNav>{children}</LayoutWithNav>
        <Toaster />

      </body>
    </html>
  );
}
