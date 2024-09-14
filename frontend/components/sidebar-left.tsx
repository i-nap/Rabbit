"use client";
import React, { useState } from "react";
import CategoryList from "./ui/category";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import InCommunities from './ui/in-Communities';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import TagSearch from "./ui/tagsearch";
import Link from "next/link";
import { X } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

const inCommunitiesRecent = [
  { communityId: 1, communityName: "AskReddit", communityImageUrl: "https://picsum.photos/id/24/367/267" },
  { communityId: 2, communityName: "Test", communityImageUrl: "https://picsum.photos/id/24/367/267" },
  // other communities...
];

const availableTags = ['React', 'Next.js', 'TypeScript', 'Tailwind', 'JavaScript', 'CSS', 'HTML'];

export default function SideBarLeft() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [communityName, setCommunityName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [logo, setLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [links, setLinks] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null); // Add state for error
  const [submitLoading, setSubmitLoading] = useState<boolean>(false); // To handle loading state

  const handleTagsChange = (tags: string[]) => {
      setSelectedTags(tags);
  };

  const handleRemoveLogo = () => {
      setLogo(null);
  };

  const handleRemoveCoverImage = () => {
      setCoverImage(null);
  };
  const { toast } = useToast(); // Use the toast hook


  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', communityName);
    formData.append('description', description || ""); // Optional description
    formData.append('tags', JSON.stringify(selectedTags));
    formData.append('links', links);
  
    if (logo) {
        formData.append('logo', logo);  // Include logo file if selected
    }
  
    if (coverImage) {
        formData.append('coverImage', coverImage);  // Include cover image file if selected
    }
  
    try {
        setSubmitLoading(true);  // Set loading state while creating the community
        const response = await axios.post('http://localhost:8080/api/community/createCommunity', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
  
        if (response.status === 200) {
            console.log('Community created successfully!');
            setNameError(null); // Clear the error if successful
            // Clear form fields after successful creation
            setCommunityName('');
            setDescription('');
            setSelectedTags([]);
            setLogo(null);
            setCoverImage(null);
            setLinks('');
  
            toast({
              title: `${communityName} successfully created!`,
              description: "You can edit the community in the community settings.",
            });
        } else {
            setNameError(response.data.message);
        }
    } catch (error) {
        console.error('Error creating community:', error);
        setNameError('An error occurred while creating the community');
    } finally {
        setSubmitLoading(false);  // Set loading state back to false after request completes
    }
  };


  return (
    <div className="flex flex-col w-full h-full px-[2rem]">
      <div className="pt-[6rem] pl-[1rem]">
        <CategoryList />
      </div>
      <Separator className="my-[2rem]" />
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Community</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[100vh] overflow-y-auto hide-scrollbar">
            <DialogHeader>
              <DialogTitle className="font-head text-3xl text-text">Create a new Community</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 w-full h-full">
              <Label htmlFor="title">Name</Label>
              <Input
                id="title"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className={`${nameError ? 'border-red-600' : ''}`} // Highlight input if there's an error
              />
              {nameError && <p className="text-red-600 text-sm">{nameError}</p>} {/* Display error */}

              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

              <Label htmlFor="tags">Tags</Label>
              <TagSearch availableTags={availableTags} onTagsChange={handleTagsChange} />

              <Label htmlFor="links">Links</Label>
              <Textarea id="links" value={links} onChange={(e) => setLinks(e.target.value)} />

              {/* Logo Upload Section */}
              <Label htmlFor="logo">Logo</Label>
              {logo ? (
                <div className="flex items-center space-x-2">
                  <span>{logo.name}</span>
                  <button onClick={handleRemoveLogo} className="text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Input id="logo" type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
              )}

              {/* Cover Image Upload Section */}
              <Label htmlFor="coverImage">Cover Image</Label>
              {coverImage ? (
                <div className="flex items-center space-x-2">
                  <span>{coverImage.name}</span>
                  <button onClick={handleRemoveCoverImage} className="text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Input id="coverImage" type="file" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={submitLoading}>
                {submitLoading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Separator className="my-[2rem]" />
      <div className="flex flex-col pl-[1rem]">
        <span className="font-lato text-[16px] text-subtext">In Communities:</span>
        <ScrollArea className="h-[15rem] mt-[1rem]">
          <div className="">
            {inCommunitiesRecent.map((community) => (
              <Link key={community.communityId} href={`/b/${community.communityName}`}>
                <InCommunities
                  {...community}
                  communityName={community.communityName}
                  communityLogoUrl={community.communityImageUrl}
                  communityId={community.communityId}
                />
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
