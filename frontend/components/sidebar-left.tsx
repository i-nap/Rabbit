"use client";
import React, { useState, useEffect } from "react";
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
import { useSelector } from 'react-redux'; // Import useSelector to get isLoggedIn from the store
import { RootState } from "@/app/store/store"; // Import RootState for Redux typing

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
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [userCommunities, setUserCommunities] = useState<any[]>([]); // State to store user-created communities

  const { isLoggedIn, userInfo } = useSelector((state: RootState) => state.user); // Get isLoggedIn and userInfo from Redux store
  const { toast } = useToast(); // Use the toast hook

  // Fetch communities created by the logged-in user
  const fetchUserCommunities = async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.get(`http://localhost:8080/api/community/user/${userInfo?.userId}/createdCommunities`);
        console.log("User-created communities:", response.data);
        setUserCommunities(response.data); // Update the communities
      } catch (error) {
        console.error("Error fetching user-created communities:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserCommunities(); // Fetch communities on component mount or when userInfo changes
  }, [isLoggedIn, userInfo]);

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', communityName);
    formData.append('description', description || "");
    formData.append('tags', JSON.stringify(selectedTags));
    formData.append('links', links);
    const userId = userInfo?.userId; // Replace with the actual way to get the userId
    if (userId !== undefined) {
      formData.append('userId', userId.toString()); // Convert userId to string
    } else {
      console.error("User ID is undefined");
      return; // Optionally handle the case where userId is not available
    }
    if (logo) {
      formData.append('logo', logo);
    }

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      setSubmitLoading(true);
      const response = await axios.post('http://localhost:8080/api/community/createCommunity', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Community created successfully!');
        setNameError(null);
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

        // Fetch the latest user communities after successful creation
        fetchUserCommunities(); // Re-fetch user communities after creation

      } else {
        setNameError(response.data.message);
      }
    } catch (error) {
      console.error('Error creating community:', error);
      setNameError('An error occurred while creating the community');
    } finally {
      setSubmitLoading(false);
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
                className={`${nameError ? 'border-red-600' : ''}`}
              />
              {nameError && <p className="text-red-600 text-sm">{nameError}</p>}
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Label htmlFor="tags">Tags</Label>
              <TagSearch availableTags={availableTags} onTagsChange={handleTagsChange} />
              <Label htmlFor="links">Links</Label>
              <Textarea id="links" value={links} onChange={(e) => setLinks(e.target.value)} />
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

      {/* Display communities created by the logged-in user */}
      {isLoggedIn && userCommunities.length > 0 && (
        <>
          <div className="pl-[1rem] mt-[1rem]">
            <h2 className="font-lato text-[16px] text-subtext">Your Communities:</h2>

            <ScrollArea
              className="mt-[1rem]"
              style={{
                maxHeight: '8rem',  // Maximum height of the scroll area
                height: userCommunities.length ? `${userCommunities.length * 2}rem` : 'auto',  // Adjust height based on number of communities
                overflowY: 'auto'  // Allow scrolling if height exceeds the limit
              }}
            >
              {userCommunities.map((community,index) => (
                <Link key={`${community.id}-${index}`} href={`/b/${community.name}`}>
                  <InCommunities
                    communityName={community.name}
                    communityLogoUrl={community.logoUrl}
                    communityId={community.id}
                  />
                </Link>
              ))}
            </ScrollArea>
          </div>
        </>
      )}


      {/* Display In Communities only when logged in */}
      {isLoggedIn && (
        <>
          <Separator className="my-[2rem]" />
          <div className="flex flex-col pl-[1rem]">
            <span className="font-lato text-[16px] text-subtext">In Communities:</span>

            <ScrollArea
              className="mt-[1rem]"
              style={{
                maxHeight: '15rem',  // Maximum height of the scroll area
                height: inCommunitiesRecent.length ? `${inCommunitiesRecent.length * 2}rem` : 'auto',  // Dynamic height based on number of communities
                overflowY: 'auto'  // Enable scrolling if content exceeds the max height
              }}
            >
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
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
