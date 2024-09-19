import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image";
import { Separator } from "./separator";

interface InCommunitiesProps {
  communityId: number;
  communityName: string;
  communityLogoUrl: string;

}
const InCommunities: React.FC<InCommunitiesProps> = ({
  communityLogoUrl,
  communityName,
}) => {

  return (
    <>

      <div className="text-[16px] font-lato  pb-[1rem]  flex items-center">
        
        <Image src={communityLogoUrl} alt={communityLogoUrl} width={24} height={24} className="w-6 h-6 mr-2 rounded-full" />
        {communityName}
      </div>
    </>

  );

};


export default InCommunities;