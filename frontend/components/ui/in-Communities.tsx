import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useState } from 'react';

interface InCommunitiesProps {
  communityId: number;
  communityName: string;
  communityLogoUrl: string;
}

const InCommunities: React.FC<InCommunitiesProps> = ({
  communityLogoUrl,
  communityName,
}) => {
  console.log(communityLogoUrl);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="text-[16px] font-lato pb-[1rem] flex items-center">
      {imageError ? (
        <div className="w-6 h-6 mr-2 rounded-full bg-gray-300 flex items-center justify-center">?</div>
      ) : (
        <Image 
          src={communityLogoUrl} 
          alt={`Logo of ${communityName}`} 
          width={24} 
          height={24} 
          className="w-6 h-6 mr-2 rounded-full" 
          onError={() => setImageError(true)}
        />
      )}
      {communityName}
    </div>
  );
};

export default InCommunities;
