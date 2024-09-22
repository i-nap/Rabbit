"use client";

import React, { useState } from "react";
import SideBarLeft from "../components/sidebar-left";
import Feed from "../components/feed";
import SideBarRight from "@/components/sidebar-right";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Trending");

  // Handler for changing category, passed to SideBarLeft
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-[18%] h-full fixed left-0 top-0">
        <SideBarLeft selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      </div>
      
      {/* Main Feed */}
      <div className="pt-32 w-[64%] ml-[18%] mr-[18%] p-[3rem]">
        <Feed selectedCategory={selectedCategory} />
      </div>
      <div className="w-[18%] h-full fixed right-0 top-0">
        <SideBarRight />
      </div>

    </div>
  );
}
