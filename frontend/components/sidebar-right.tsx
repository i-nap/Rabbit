import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SideBar from "./sidebar-left";
import TopContributors from "./ui/topcontributor";
import { Separator } from "./ui/separator";
import SuggestionsForYou from "./ui/suggestionforyou";
import Footer from "./ui/footer";

const Suggestions = [
  {
    communityId: 1,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
  {
    communityId: 2,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
  {
    communityId: 3,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
  {
    communityId: 4,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
  {
    communityId: 5,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
];

export default function SideBarRight() {
  return (
    <div className="flex flex-col justify-between h-screen pt-[6rem] px-[1rem]">
      <div className="flex-grow">
        <span className="font-lato text-[16px] text-subtext mb-[1rem] block">
          Suggestions For You:
        </span>
        {Suggestions.map((community) => (
          <SuggestionsForYou
            key={community.communityId}
            {...community}
            communityName={community.communityName}
            communityLogoUrl={community.communityImageUrl}
            communityId={community.communityId}
          />
        ))}

        <Separator className="my-[2rem]" />

        <TopContributors />

        <Separator className="my-[2rem]" />
      </div>
      
      <Footer />
    </div>
  );
}
