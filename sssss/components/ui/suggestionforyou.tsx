import Image from "next/image";

interface Suggestions {
  communityId: number;
  communityName: string;
  communityLogoUrl: string;
}

export default function SuggestionsForYou({ communityName, communityLogoUrl }: Suggestions) {
  return (
    <div className="text-[16px] font-lato pb-[1rem] flex items-center">
      <Image 
        src={communityLogoUrl} 
        alt={communityName} 
        width={24} 
        height={24} 
        className="w-6 h-6 mr-2 rounded-full" 
      />
      {communityName}
    </div>
  );
}
