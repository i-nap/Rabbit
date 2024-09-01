import { House } from "lucide-react";

export default function LeftSide() {
  return (
    <div className="flex flex-col ml-6 sm:ml-8 lg:ml-[3rem] text-white space-y-8 sm:space-y-12 lg:space-y-[5rem]">
      <div className="flex space-x-4 sm:space-x-6 lg:space-x-[1rem] text-lg sm:text-xl lg:text-2xl items-center">
      <House className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
        <span>Name</span>
      </div>

      <div className="text-2xl sm:text-3xl lg:text-4xl leading-snug lg:leading-relaxed mr-8 sm:mr-12 lg:mr-[6rem]">
        <span>A few clicks away from creating your Dream Home</span>
      </div>
    </div>
  );
}
