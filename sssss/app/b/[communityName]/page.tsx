import CommunityProfileFeed from "@/components/b/communityprofilefeed";
import CommunityProfileHeader from "@/components/b/communityprofileheader";
import Feed from "@/components/feed";
import SideBarLeft from "@/components/sidebar-left";
import SideBarRight from "@/components/sidebar-right";

export default function CommunityPage({
  params,
}: {
  params: { communityName: string };
}) {
  const { communityName } = params;

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
            <CommunityProfileHeader communityName={communityName} />
            <CommunityProfileFeed/>
        </div>
      </div>
    </>
  );
}
