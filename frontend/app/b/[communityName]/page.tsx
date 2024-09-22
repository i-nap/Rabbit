'use client'
import CommunityProfileFeed from "@/components/b/communityprofilefeed";
import CommunityProfileHeader from "@/components/b/communityprofileheader";
import Feed from "@/components/feed";
import SideBarLeft from "@/components/sidebar-left";
import SideBarRight from "@/components/sidebar-right";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams,usePathname } from 'next/navigation';

export default function CommunityPage({
  params,
}: {
  params: { communityName: string };
}) {
  const { communityName } = params;
  const router = useRouter(); // useRouter hook to get the router object

  // Fetch the community data based on the communityName
  const communityData = {
    description: `Welcome to the ${communityName} community!`,
  };

  return (
    <>

    
      <div className="flex w-full h-screen">
        <div className="w-[18%] h-full fixed left-0 top-0">
          <SideBarLeft />
        </div>
        <div className="pt-32 w-[75%] ml-[18%] pl-[3rem] h-full overflow-y-auto hide-scrollbar space-y-[2rem]">
          {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => {
          
              router.back();
          }}
          className="flex items-center px-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
            <CommunityProfileHeader communityName={communityName} showButtons={true}/>
            <CommunityProfileFeed/>
        </div>
      </div>
    </>
  );
}
