"use client"
import React, { useState } from "react";
import CategoryList from "./ui/category";
import { Cat, Plus, Star } from "lucide-react";
import { FlameIcon, TrendingUp, SunIcon } from "lucide-react"; // Import different icons
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import InCommunities from './ui/in-Communities';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import TagSearch from "./ui/tagsearch";

const availableTags = ['React', 'Next.js', 'TypeScript', 'Tailwind', 'JavaScript', 'CSS', 'HTML'];

const inCommunitiesRecent = [

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
  {
    communityId: 6,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
  {
    communityId: 7,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
  {
    communityId: 8,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
  {
    communityId: 9,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
  {
    communityId: 10,
    communityName: "r/AskReddit",
    communityImageUrl: "https://picsum.photos/id/24/367/267",
  },
]
export default function SideBarLeft() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };
  return (
    <>
      <div className="flex flex-col w-full h-full border-r px-[2rem]">
        <div className="pt-[6rem] pl-[1rem]">
          <CategoryList />
        </div>
        <Separator className="my-[2rem]" />
        <div className="flex justify-center ">
        <Dialog>
              <DialogTrigger asChild>
                <div>
                <Button>
            <Plus className="w-4 h-4" />{" "}
            <span className="ml-1">New Community</span>
          </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto hide-scrollbar">
                <DialogHeader>
                  <DialogTitle className="font-head text-3xl text-text">
                    Create a new Community
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 w-full h-full">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-left font-lato text-text">
                      Name
                    </Label>
                    <Input id="title" defaultValue="" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 font-lato text-text">
                    <Label htmlFor="images" className="text-left">
                      Logo
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="body" className="text-left font-lato text-text">
                      Description
                    </Label>
                    <Textarea
                      id="body"
                      defaultValue=""
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4 font-lato text-text">
                  <Label htmlFor="body" className="text-left font-lato text-text">
                      Tags
                    </Label>
                  <TagSearch availableTags={availableTags} onTagsChange={handleTagsChange} />

                  </div>

                  <div className="grid grid-cols-4 items-center gap-4 font-lato text-text">
                    <Label htmlFor="links" className="text-left">
                      Links
                    </Label>
                    <Textarea
                      id="links"
                      placeholder="Add links here..."
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
        <Separator className="my-[2rem]" />

        <div className="flex flex-col pl-[1rem]">
          <span className="font-lato text-[16px] text-subtext">In Communities:</span>
          <ScrollArea className="h-[15rem] mt-[1rem]">
            <div className="">
              {inCommunitiesRecent.map((community, index) => (
                <InCommunities key={community.communityId} {...community} communityName={community.communityName} communityLogoUrl={community.communityImageUrl} communityId={community.communityId} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
