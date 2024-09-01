import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export default function TopContributors() {
  const contributors = [
    {
      name: "John Doe",
      image: "https://picsum.photos/seed/picsum/200/200",
    },
    {
      name: "Jane Smith",
      image: "https://picsum.photos/seed/picsum1/200/200",
    },
    {
      name: "Alice Johnson",
      image: "https://picsum.photos/seed/picsum2/200/200",
    },
    {
      name: "Bob Brown",
      image: "https://picsum.photos/seed/picsum3/200/200",
    },
    {
      name: "Charlie Green",
      image: "https://picsum.photos/seed/picsum4/200/200",
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex flex-col space-x-4 items-center space-y-[1rem]">
        <h2 className="font-lato text-[16px] text-subtext">Top Contributors</h2>
        <div className="flex -space-x-3">
          {contributors.map((contributor, index) => (
            <Tooltip key={index}>
              <TooltipTrigger>
                <Avatar className="w-10 h-10 border-2 border-background">
                  <AvatarImage src={contributor.image} alt={contributor.name} />
                  <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{contributor.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
