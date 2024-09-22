import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SideBar from "./sidebar-left";
import TopContributors from "./ui/topcontributor";
import { Separator } from "./ui/separator";
import SuggestionsForYou from "./ui/suggestionforyou";
import Footer from "./ui/footer";

// Define the type for community suggestions
interface Community {
  communityId: number;
  communityName: string;
  communityImageUrl: string;
}

export default function SideBarRight() {
  const [suggestions, setSuggestions] = useState<Community[]>([]);

  useEffect(() => {
    const fetchRandomCommunities = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/community/random");
        console.log("Raw API response:", response.data); // Debug: Log raw response

        // Map the backend data to the expected structure
        const mappedSuggestions = response.data.map((community: any) => ({
          communityId: community.id,           // Backend 'id' mapped to 'communityId'
          communityName: community.name,       // Backend 'name' mapped to 'communityName'
          communityImageUrl: community.logoUrl || "/logo.svg",  // Add a fallback for image URL
        }));
        console.log("Mapped suggestions:", mappedSuggestions); // Debug: Log mapped suggestions

        setSuggestions(mappedSuggestions);
      } catch (error) {
        console.error("Error fetching community suggestions:", error);
        setSuggestions([]); // Handle error by setting an empty array
      }
    };

    fetchRandomCommunities();
  }, []); // Empty dependency array ensures this effect runs only once after the component mounts

  return (
    <div className="flex flex-col justify-between h-screen pt-[6rem] px-[2rem]">
      <div className="flex-grow">
        <div className="pl-[1rem]">
          <span className="font-lato text-[16px] text-subtext mb-[1rem] block">
            Suggestions For You:
          </span>

          {suggestions.length > 0 ? (
            suggestions.map((community) => (
              <Link key={community.communityId} href={`/b/${community.communityName}`} passHref>
                  <SuggestionsForYou
                    communityName={community.communityName}
                    communityLogoUrl={community.communityImageUrl}
                    communityId={community.communityId}
                  />
              </Link>
            ))
          ) : (
            <p>Loading suggestions...</p>
          )}
        </div>

        <Separator className="my-[2rem]" />
        <TopContributors />
        <Separator className="my-[2rem]" />
      </div>

      <Footer />
    </div>
  );
}
