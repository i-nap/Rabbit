import Image from "next/image";

interface Suggestions {
  communityId: number;
  communityName: string;
  communityLogoUrl: string | null; // Updated to handle null value as well
}

export default function SuggestionsForYou({ communityName, communityLogoUrl }: Suggestions) {
  // Check if communityLogoUrl is null, undefined, or an empty string and use the fallback "/logo.svg"
  const logoUrl = communityLogoUrl && communityLogoUrl.trim() !== "" ? communityLogoUrl : "/logo.svg";

  return (
    <div className="text-[16px] font-lato pb-[1rem] flex items-center">
      <Image 
        src={logoUrl} 
        alt={communityName} 
        width={24} 
        height={24} 
        className="w-6 h-6 mr-2 rounded-full" 
      />
      {communityName}
    </div>
  );
}
