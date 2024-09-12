"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface FeedPostProps {
  id: number;
  subreddit: string;
  subredditImage: string;
  time: string;
  title: string;
  content: string;
  votes: number;
  comments: number;
  imageUrl?: string;
}

const FeedPost: React.FC<FeedPostProps> = ({
  id,
  subreddit,
  subredditImage,
  time,
  title,
  content,
  votes,
  comments,
  imageUrl,
}) => {
  const [upClicked, setUpClicked] = useState(false);
  const [downClicked, setDownClicked] = useState(false);
  const [voteCount, setVoteCount] = useState(votes);

  const handleUpClick = () => {
    if (upClicked) {
      setUpClicked(false);
      setVoteCount(voteCount - 1);
    } else {
      setUpClicked(true);
      setDownClicked(false);
      setVoteCount(downClicked ? voteCount + 2 : voteCount + 1);
    }
  };

  const handleDownClick = () => {
    if (downClicked) {
      setDownClicked(false);
      setVoteCount(voteCount + 1);
    } else {
      setDownClicked(true);
      setUpClicked(false);
      setVoteCount(upClicked ? voteCount - 2 : voteCount - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-[2rem] hover:shadow-lg transition-all duration-200 ease-in-out text-text">
      <div className="flex items-center mb-2 font-lato">
        <div className="relative w-6 h-6 mr-2">
          <Image
            src={subredditImage}
            alt={`r/${subreddit}`}
            fill
            className="rounded-full"
          />
        </div>
        <span className="font-bold text-sm">r/{subreddit}</span>
        <span className="text-xs text-subtext ml-2">{time}</span>
      </div>
      <h2 className="text-2xl font-bold mb-2 font-head">{title}</h2>
      <p className="text-subtext mb-4 font-lato text-[16px]">{content}</p>
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
      <div className="flex items-center space-x-5">
        <div className="flex font-medium font-head text-[20px] justify-center items-center">
          <ArrowUp
            className={`cursor-pointer transition-all duration-200 ease-in-out ${
              upClicked ? "text-green-500" : "hover:text-gray-500"
            }`}
            onClick={handleUpClick}
            aria-label="Upvote"
          />
          <span className="ml-2 mr-2">{voteCount}</span>
          <ArrowDown
            className={`cursor-pointer transition-all duration-200 ease-in-out ${
              downClicked ? "text-red-500" : "hover:text-gray-500"
            }`}
            onClick={handleDownClick}
            aria-label="Downvote"
          />
        </div>
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
