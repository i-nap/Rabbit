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
  showButtons?: boolean; // New prop to control button visibility
};

type CommunityData = {
  name: string;
  description: string;
  tags?: string[] | string[];  // 'tags' can be undefined
  logoUrl: string;
  coverImageUrl: string;
  links?: string;  // Links can be a string or array of strings
};


export default function CommunityProfileHeader({ communityName, showButtons = true }: CommunityProfileProps) {
  const [isJoined, setIsJoined] = useState(false); // Track join state
  const [isCreator, setIsCreator] = useState(false); // Track if the user created the community
  const { toast } = useToast(); // Use the toast hook
  const { isLoggedIn, userInfo } = useSelector((state: RootState) => state.user);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null); // Use the defined type


  // Fetch community data
  const fetchCommunityData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/community/${communityName}`);
      setCommunityData(response.data);
      console.log(response.data)// Store original community data
    } catch (error) {
      console.error("Failed to fetch community data:", error);
      toast({
        title: 'Error',
        description: 'Failed to load community data.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCommunityData(); // Fetch community data
  }, [communityName]);

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

  useEffect(() => {
    fetchCommunityData(); // Fetch community data
  }, [communityName]);

  if (!communityData) {
    return <div>Loading community details...</div>;  // Show loading state while community data is being fetched
  }

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
            src={communityData.coverImageUrl || "/tile_background.png"}         // Fallback to default logo
            // Fallback to a default image if coverImageUrl is not available
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />

          {/* Avatar and Stats Section */}
          <div className="absolute -bottom-[4rem] left-6 flex items-end space-x-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-8 border-white">
              <Image
                src={communityData.logoUrl || "/logo.svg"}  // Fallback to a default avatar if logoUrl is not available
                alt="Avatar"
                width={80}
                height={80}
                objectFit="fit"
                className="w-full h-full"
              />
            </div>

            {/* Stats */}
            {showButtons && (
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
            )}
          </div>
        </div>

        <div className="flex flex-col mt-[5rem] mb-[2rem] space-y-3 px-12">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-head m-0 p-0 text-text">b/{communityName}</h1>
              <Star />
            </div>
            {showButtons && (
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
            )}
          </div>

          {/* Community Description */}
          <span className="text-subtext font-lato text-[16px]">
            {communityData.description}
          </span>

          {/* Community Links Section */}
          {communityData.links && (
            <div className="mt-4">
              <div className="flex flex-wrap space-x-2"> {/* Updated to flex-wrap for better responsiveness */}
                {communityData.links.split(' ').map((link, index) => {
                  const trimmedLink = link.trim();
                  if (!trimmedLink) return null; // Skip empty links

                  // Ensure the link includes the protocol
                  const validLink = trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://')
                    ? trimmedLink
                    : `http://${trimmedLink}`;

                  return (
                    <a key={index} href={validLink} target="_blank" rel="noopener noreferrer" className="text-black hover:underline mb-2">
                      {validLink}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Community Tags Section */}
          {communityData.tags && communityData.tags.length > 0 ? (
            <div className="mt-4">
              <div className="flex flex-wrap space-x-2">
                {communityData.tags.map((encodedTag, index) => {
                  try {
                    // Attempt to parse each tag if it's JSON-encoded
                    const tag = JSON.parse(encodedTag);
                    return (
                      <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-lg text-sm">
                        #{tag}
                      </span>
                    );
                  } catch (error) {
                    console.error("Error parsing tag:", encodedTag, error);
                    return null;
                  }
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}  
