"use client";
import FeedPost from "./ui/post";
import { Separator } from "@/components/ui/separator";
import { ComboBoxResponsive } from "./ui/combobox";
import CreatePostDialog from "./ui/createpostdialog"; // Import the new dialog component
import { useEffect, useState } from "react";
import { Card, Carousel } from "./ui/headCarousel";
import { Label } from "./ui/label";

const posts = [
  {
    id: 1,
    subreddit: "reactjs",
    subredditImage: "https://picsum.photos/id/24/367/267",
    time: "1 hour ago",
    title: "How to use useState hook?",
    content: "I'm having trouble using the useState hook in React...",
    votes: 100,
    comments: 50,
  },
  {
    id: 2,
    subreddit: "javascript",
    subredditImage: "https://picsum.photos/id/24/367/267",
    time: "2 hours ago",
    title: "Understanding closures",
    content: "Can someone explain closures in JavaScript?",
    votes: 200,
    comments: 80,
    imageUrl: "https://picsum.photos/id/26/367/267",
  },
];

const optionsCountry = [
  { value: "all", label: "All" },
  { value: "nepal", label: "Nepal" },
  { value: "japan", label: "Japan" },
  { value: "usa", label: "USA" },
];

const items = [
  {
    src: "https://picsum.photos/id/237/200/300",
    title: "Card Title 1",
    category: "Category 1",
    content: <p>This is the content for card 1.</p>,
  },
  {
    src: "https://picsum.photos/id/237/200/300",
    title: "Card Title 2",
    category: "Category 2",
    content: <p>This is the content for card 1.</p>,
  },
  {
    src: "https://picsum.photos/id/237/200/300",
    title: "Card Title 3",
    category: "Category 3",
    content: <p>This is the content for card 1.</p>,
  },
  // Add more card items as needed
];

export default function Feed() {
  const [cards, setCards] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setCards(
      items.map((item, index) => (
        <Card card={item} index={index} key={index} layout />
      ))
    );
  }, []);

  return (
    <>
      <div className="flex flex-col w-full h-screen max-h-[38rem] min-h-[30rem]">
        <div className="flex w-full space-x-4 items-center justify-between">
          <h1 className="text-3xl font-head m-0 p-0 text-text">Popular</h1>
          <div className="flex items-center">
            <Label htmlFor="popular" className="mr-4 text-text">
              Popular in:
            </Label>
            <ComboBoxResponsive
              options={optionsCountry}
              widthDesktop="100px"
              initialSelection="All"
              widthMobile="100px"
              showImages={false}
            />
            {/* Use the CreatePostDialog Component */}
            <CreatePostDialog />
          </div>
        </div>
        <Carousel items={cards} initialScroll={0} />
        <Separator className="mt-6" />
      </div>

      <div className="pt-[2rem] flex flex-col w-full h-full">
        {posts.map((post) => (
          <FeedPost key={post.id} {...post} />
        ))}
      </div>
    </>
  );
}
