"use client";

import { ComboBoxResponsive } from "./combobox";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const optionsCommunity = [
  {
    value: "option1",
    label: "Option 1",
    image: "https://picsum.photos/id/24/367/267",
  },
  {
    value: "option2",
    label: "Option 2",
    image: "https://picsum.photos/id/24/367/267",
  },
];

export default function CreatePostDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-6">
          <CirclePlus className="h-4 w-4" /> <span className="ml-1">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="font-head text-3xl text-text">
            Create a Post
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 w-full h-full">
          <ComboBoxResponsive
            widthDesktop="full"
            widthMobile="full"
            initialSelection="Select a Community"
            options={optionsCommunity}
            showImages={true}
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-left font-lato text-text">
              Title
            </Label>
            <Input id="title" defaultValue="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="body" className="text-left font-lato text-text">
              Body
            </Label>
            <Textarea id="body" defaultValue="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 font-lato text-text">
            <Label htmlFor="images" className="text-left">
              Images
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="col-span-3"
            />
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
          <Button type="submit" className="w-full">
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
