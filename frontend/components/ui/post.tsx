'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store'; // Adjust path to your store configuration
import { useToast } from '@/hooks/use-toast'; // Assuming you're using a custom toast hook

interface FeedPostProps {
  id: number;
  community: string;
  communityImage: string;
  time: string;
  title: string;
  content: string;
  votes: number;
  comments: number;
  imageUrl?: string;
  username: string;
}

const FeedPost: React.FC<FeedPostProps> = ({
  id,
  community,
  communityImage,
  time,
  title,
  content,
  votes,
  comments,
  imageUrl,
  username,
}) => {
  const { toast } = useToast(); // Use toast to show a message
  const [upClicked, setUpClicked] = useState(false);
  const [downClicked, setDownClicked] = useState(false);
  const [voteCount, setVoteCount] = useState(votes);

  // Get the logged-in userId from Redux store (userSlice)
  const userId = useSelector((state: RootState) => state.user.userInfo?.userId);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn); // To detect login/logout

  // Reset voting state on logout
  useEffect(() => {
    if (!isLoggedIn) {
      // Reset vote state when user logs out
      setUpClicked(false);
      setDownClicked(false);
    }
  }, [isLoggedIn]);

  // Fetch vote status when the component mounts
  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}/vote-status`, {
          params: { userId }, // Use userId from Redux
        });

        const { voteStatus } = response.data;

        // Update the UI based on the vote status
        if (voteStatus === 'upvote') {
          setUpClicked(true);
          setDownClicked(false);
        } else if (voteStatus === 'downvote') {
          setDownClicked(true);
          setUpClicked(false);
        } else {
          setUpClicked(false);
          setDownClicked(false);
        }
      } catch (error) {
        console.error('Error fetching vote status:', error);
      }
    };

    if (userId) {
      fetchVoteStatus();
    }
  }, [id, userId]);

  // Handle vote logic and backend call
  const handleVote = async (isUpvote: boolean) => {
    if (!userId) {
      // Show toast if the user is not logged in
      toast({
        title: "Login required",
        description: "You need to log in to vote.",
      });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/posts/${id}/vote`, {
        userId, // Use userId from Redux
        isUpvote,
      });

      const { newVoteCount } = response.data;

      // Update vote count based on backend response
      setVoteCount(newVoteCount);

      // Toggle upvote or downvote states
      if (isUpvote) {
        setUpClicked((prev) => !prev);
        setDownClicked(false); // Reset downvote if upvote is clicked
      } else {
        setDownClicked((prev) => !prev);
        setUpClicked(false); // Reset upvote if downvote is clicked
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  // Handlers for upvote and downvote clicks
  const handleUpClick = () => handleVote(true);
  const handleDownClick = () => handleVote(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-[2rem] hover:shadow-lg transition-all duration-200 ease-in-out text-text">
      {/* Post Header: Community Image, Community Name, and Time */}
      <div className="flex items-center mb-2 font-lato">
        <div className="relative w-6 h-6 mr-2">
          <Image
            src={communityImage}
            alt={`b/${community}`}
            fill
            className="rounded-full"
          />
        </div>
        <span className="font-bold text-sm">b/{community}</span>
        <span className="font-bold text-sm ml-2">{username}</span>
        <span className="text-xs text-subtext ml-2">{time}</span>
      </div>

      {/* Post Title and Content */}
      <h2 className="text-2xl font-bold mb-2 font-head">{title}</h2>
      <p className="text-subtext mb-4 font-lato text-[16px]">{content}</p>

      {/* Conditional Image Rendering */}
      {imageUrl && (
        <div className="mb-4 w-full">
          <div className="relative w-full h-[30rem] bg-black rounded-2xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              style={{ objectFit: 'contain' }}
              className="absolute inset-0"
            />
          </div>
        </div>
      )}

      {/* Voting and Comments Section */}
      <div className="flex items-center space-x-5">
        {/* Voting Buttons and Count */}
        <div className="flex font-medium font-head text-[20px] justify-center items-center">
          <ArrowUp
            className={`cursor-pointer transition-all duration-200 ease-in-out ${
              upClicked ? 'text-green-500' : 'hover:text-gray-500'
            }`}
            onClick={handleUpClick}
            aria-label="Upvote"
          />
          <span className="ml-2 mr-2">{voteCount}</span>
          <ArrowDown
            className={`cursor-pointer transition-all duration-200 ease-in-out ${
              downClicked ? 'text-red-500' : 'hover:text-gray-500'
            }`}
            onClick={handleDownClick}
            aria-label="Downvote"
          />
        </div>

        {/* Comments Button */}
        <div className="flex space-x-2">
          <Link href={`/${id}`}>
            <Button className="w-20 hover:text-gray-500 transition-all duration-200 ease-in-out">
              <MessageCircle className="cursor-pointer" />
              <span className="ml-1">{comments}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FeedPost);
