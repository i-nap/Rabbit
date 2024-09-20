'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import CreatePostDialog from '../ui/createpostdialog';
import { useToast } from "../../hooks/use-toast"; // Ensure correct path
import axios from 'axios'; // Import axios
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";  // Import RootState from Redux store
import Link from 'next/link';

type CommunityProfileProps = {
  communityName: string;
  communityId: number;
};

export default function CommunityProfileHeader({ communityName, communityId }: CommunityProfileProps) {
  const [isJoined, setIsJoined] = useState(false); // Track join state
  const [isCreator, setIsCreator] = useState(false); // Track if the user created the community
  const { toast } = useToast(); // Use the toast hook
  const { isLoggedIn, userInfo } = useSelector((state: RootState) => state.user);

  // Function to check if the user is already subscribed to the community
  const fetchSubscriptionStatus = async () => {
    if (userInfo?.userId) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/community/${communityName}/isJoined?userId=${userInfo.userId}`
        );
        setIsJoined(response.data.isJoined);  // Assuming the response contains `isJoined`
      } catch (error) {
        console.error("Error checking subscription status:", error);
      }
    }
  };

  // Function to check if the user is the creator of the community
  const fetchCreatorStatus = async () => {
    if (userInfo?.userId) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/community/${communityName}/isCreator?userId=${userInfo.userId}`
        );
        setIsCreator(response.data.isCreator); // Assuming the response contains `isCreator`
      } catch (error) {
        console.error("Error checking creator status:", error);
      }
    }
  };

  // Fetch subscription and creator status when the component mounts
  useEffect(() => {
    if (isLoggedIn && userInfo?.userId) {
      fetchSubscriptionStatus();  // Check subscription status when user logs in
      fetchCreatorStatus(); // Check creator status when user logs in
    }
  }, [isLoggedIn, userInfo]);

  const handleJoinToggle = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/community/${communityName}/${isJoined ? 'leave' : 'join'}?userId=${userInfo?.userId}`
      );

      if (response.status === 200) {
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
      } else {
        throw new Error("Failed to update community status.");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while joining/leaving the community.",
      });
    }
  };

  const handleDeleteCommunity = () => {
    // Open a dialog box or confirm prompt to delete the community
    if (confirm(`Are you sure you want to delete the ${communityName} community?`)) {
      // Make a delete request to the backend
      axios.delete(`http://localhost:8080/api/community/${communityName}?userId=${userInfo?.userId}`)
        .then(() => {
          toast({
            title: "Community deleted",
            description: `The ${communityName} community has been successfully deleted.`,
          });
        })
        .catch(error => {
          console.error(error);
          toast({
            title: "Error",
            description: "An error occurred while deleting the community.",
          });
        });
    }
  };

  return (
    <div className="w-full">
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
                <span className="text-gray-500">Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-[5rem] mb-[2rem] space-y-3 px-12">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-head m-0 p-0 text-text">b/{communityName}</h1>
              <Star />
            </div>
            <div className="flex space-x-4">
              <CreatePostDialog />
              {/* Conditionally render the delete or join/leave button */}
              {isCreator ? (
                <div className="flex space-x-4">
                  <Button variant="destructive" onClick={handleDeleteCommunity}>
                    <span>Delete Community</span>
                  </Button>
                  <Link href={`/b/${communityName}/edit`} passHref>
              <Button variant={"outline"}>Edit Community</Button>
                  </Link>
                </div>

              ) : (
                <Button
                  variant={isJoined ? "destructive" : "outline"}
                  onClick={handleJoinToggle}
                >
                  <span>{isJoined ? "Leave" : "Join"}</span>
                </Button>
              )}
            </div>
          </div>

          <span className="text-subtext font-lato text-[16px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit consequatur est, laudantium commodi ex dolorem eligendi perspiciatis assumenda temporibus magni modi veritatis ipsum atque, voluptas sapiente quasi nisi, quibusdam dolore.
          </span>
        </div>
      </div>
    </div>
  );
}
