"use client";

import { useState } from "react";
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
import { useToast } from "../../hooks/use-toast";
import axios from "axios";


const optionsCommunity = [
  {
    value: "Reddit",
    label: "Reddit",
    image: "https://picsum.photos/id/24/367/267",
  },
  {
    value: "option2",
    label: "Option 2",
    image: "https://picsum.photos/id/24/367/267",
  },
];

export default function CreatePostDialog() {
  const { toast } = useToast(); // Use the toast hook

  const [community, setCommunity] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [links, setLinks] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

 // Assuming you're using a toast utility
  
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append(
      "post",
      new Blob(
        [JSON.stringify({
          community,
          title,
          body,
          links,
        })],
        { type: 'application/json' } // Ensures correct content type for JSON
      )
    );
  
    images.forEach((image) => formData.append("images", image));
  
    try {
      const response = await axios.post("http://localhost:8080/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Handle JSON or text response depending on server response
      if (response.data) {
        const result = response.data; // Axios automatically parses JSON
        console.log(result.message);
  
        // Show success toast
        toast({
          title: "Post Created Successfully!",
          description: `Your post in the ${community} community was created successfully.`,
    
        });
      } else {
        // Show success toast for non-JSON responses
        console.log(response);
        toast({
          title: "Post Created Successfully!",
          description: "Your post was created successfully.",

        });
      }
  
    } catch (error) {
      console.error("Error creating post:", error);
  
      // Show error toast
      toast({
        title: "Error",
        description: "An error occurred while creating the post.",

      });
    }
  };
  

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
            onSelectionChange={setCommunity}
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-left font-lato text-text">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="body" className="text-left font-lato text-text">
              Body
            </Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="col-span-3"
            />
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
              onChange={handleImagesChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 font-lato text-text">
            <Label htmlFor="links" className="text-left">
              Links
            </Label>
            <Textarea
              id="links"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit" className="w-full">
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
