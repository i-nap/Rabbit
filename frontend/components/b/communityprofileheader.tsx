'use client'
import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import CreatePostDialog from '../ui/createpostdialog';
import { useToast } from "../../hooks/use-toast"; // Ensure correct path

type CommunityProfileProps = {
  communityName: string;
};

export default function CommunityProfileHeader({ communityName }: CommunityProfileProps) {
  const [isJoined, setIsJoined] = useState(false); // Track join state
  const { toast } = useToast(); // Use the toast hook

  const handleJoinToggle = () => {
    setIsJoined(!isJoined); // Toggle join state

    // Trigger a Toast notification when joined or left
    if (!isJoined) {
      toast({
        title: `You joined the ${communityName} community!`,
        description: "Welcome to the community, start exploring the content.",
      });
    } else {
      toast({
        title: `You left the ${communityName} community.`,
        description: "Feel free to rejoin anytime!",
      });
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Background Image */}
      <div className="bg-white w-full overflow-hidden rounded-3xl">
        <div className="relative h-56 w-full">
          <Image
            src="https://picsum.photos/id/32/4032/3024" // Replace with your background image
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="w-full h-full "
          />

          {/* Avatar and Stats Section */}
          <div className="absolute -bottom-[4rem] left-6 flex items-end space-x-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-8 border-white ">
              <Image
                src="https://picsum.photos/id/38/1280/960" // Replace with your avatar image
                alt="Avatar"
                width={80}
                height={80}
                objectFit="cover"
                className="w-full h-full"
              />
            </div>

            {/* Stats */}
            <div className="flex space-x-[2rem] pb-5">
              <div className="flex text-xl space-x-2">
                <span className="font-bold ">1.25k</span>
                <span className="text-gray-500">Members</span>
              </div>
              <div className="flex text-xl space-x-2">
                <span className="font-bold">455</span>
                <span className=" text-gray-500">Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-[5rem] mb-[2rem] space-y-2 px-12">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-head  m-0 p-0 text-text">b/{communityName}</h1>
              <Star />
            </div>
            <div className="flex space-x-4">
              <CreatePostDialog />
              {/* Join/Leave Button */}
              <Button
                className=""
                variant={isJoined ? "secondary" : "default"}
                onClick={handleJoinToggle}
              >
                <span>{isJoined ? "Leave" : "Join"}</span>
              </Button>
            </div>
          </div>

          <span className="text-subtext mb-4 font-lato text-[16px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit consequatur est, laudantium commodi ex dolorem eligendi perspiciatis assumenda temporibus magni modi veritatis ipsum atque, voluptas sapiente quasi nisi, quibusdam dolore.
          </span>
        </div>
      </div>
    </div>
  );
}
