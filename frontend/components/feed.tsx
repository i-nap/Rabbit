import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedPost from "./ui/post";
import { Separator } from "@/components/ui/separator";
import { ComboBoxResponsive } from "./ui/combobox";
import CreatePostDialog from "./ui/createpostdialog";
import { Card, Carousel } from "./ui/headCarousel";
import { Label } from "@/components/ui/label";

interface Post {
  id: number;
  community: string;
  communityImage: string;
  time: string;
  title: string;
  content: string;
  votes: number;
  comments: number;
  username: string;
  imageUrl?: string;
}

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
];

export default function Feed() {
  const [cards, setCards] = useState<JSX.Element[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  useEffect(() => {
    setCards(
      items.map((item, index) => (
        <Card card={item} index={index} key={index} layout />
      ))
    );
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts/getposts");
        setPosts(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleSelectionChange = (value: string) => {
    setSelectedCountry(value);
  };

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
              onSelectionChange={handleSelectionChange}
            />
            <CreatePostDialog />
          </div>
        </div>
        <Carousel items={cards} initialScroll={0} />
        <Separator className="mt-6" />
      </div>

      <div className="pt-[2rem] flex flex-col w-full h-full">
        {posts.map((post) => (
          <FeedPost
            key={post.id}
            id={post.id}
            community={post.community}
            communityImage={post.communityImage}
            time={post.time}
            title={post.title}
            content={post.content}
            votes={post.votes}
            comments={post.comments}
            imageUrl={post.imageUrl}
            username={post.username}
          />
        ))}
      </div>
    </>
  );
}
