import { ArrowLeft, House } from "lucide-react";
import Link from "next/link";

export default function LeftSide() {
  return (
    <div className="flex flex-col ml-6 sm:ml-8 lg:ml-[3rem] text-white space-y-8 sm:space-y-12 lg:space-y-[5rem]">
      <div className="flex flex-col space-y-[2rem] text-lg sm:text-xl lg:text-2xl">
        <Link href="/"><ArrowLeft /></Link>

        <div className="flex space-x-4">
          <House className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
          <span>Name</span>
        </div>
      </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl leading-snug lg:leading-relaxed mr-8 sm:mr-12 lg:mr-[6rem]">
        <span>Hop into endless conversations and discover your next favorite community on Rabbit!</span>
      </div>
    </div>
  );
}
