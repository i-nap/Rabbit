import React from "react";
import CategoryList from "./ui/category";
import { Cat, Star } from "lucide-react";
import { FlameIcon, TrendingUp, SunIcon } from "lucide-react"; // Import different icons
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function LeftSide() {
  return (
    <>
      <div className="pt-[6rem] pl-[3rem] flex flex-col w-full h-full">
        <div>
        <CategoryList />
        </div>
        <Separator/>
      </div>
    </>
  );
}
