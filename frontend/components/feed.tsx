"use client";
import FeedPost from "./ui/post";
import { Separator } from "@/components/ui/separator"

import { ComboBoxResponsive } from "./ui/combobox";
import { Button } from "@/components/ui/button";
import { CirclePlus, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Card, Carousel } from "./ui/headCarousel";

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
  // Add more options as needed
];
const items = [
  {
    src: "https://picsum.photos/id/237/200/300",
    title: "Card Title 1",
    category: "Category 1",
    content: <p>This is the content for card 1.</p>,
  },
  {
    src: "https://picsum.photos/id/13/367/267",
    title: "Card Title 2",
    category: "Category 2",
    content: <p>This is the content for card 2.</p>,
  },
  {
    src: "https://picsum.photos/id/18/367/267 ",
    title: "Card Title 3",
    category: "Category 3",
    content: <p>This is the content for card 3.</p>,
  },
  {
    src: "/images/image2.jpg",
    title: "Card Title 4",
    category: "Category 4",
    content: <p>This is the content for card 3.</p>,
  },
  {
    src: "/images/image2.jpg",
    title: "Card Title 5",
    category: "Category 5",
    content: <p>This is the content for card 3.</p>,
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



  const [voteStatus, setVoteStatus] = useState(
    posts.map(() => ({ upClicked: false, downClicked: false }))
  );

  const handleUpClick = (index: number) => {
    setVoteStatus((prev) =>
      prev.map((status, i) =>
        i === index
          ? { upClicked: !status.upClicked, downClicked: false }
          : status
      )
    );
  };

  const handleDownClick = (index: number) => {
    setVoteStatus((prev) =>
      prev.map((status, i) =>
        i === index
          ? { downClicked: !status.downClicked, upClicked: false }
          : status
      )
    );
  };
  return (
    <>
      <div className="pt-32 flex flex-col w-full h-screen max-h-[38rem] min-h-[30rem]">
        <div className="flex w-full space-x-4 items-center justify-between">
          <h1 className="text-3xl font-head  m-0 p-0 text-text">Popular</h1>
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
            <Dialog>
              <DialogTrigger asChild>

                  <Button className="ml-6">
                    <CirclePlus className="h-4 w-4" />{" "}
                    <span className="ml-1">Create</span>
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
                  ></ComboBoxResponsive>
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
                    <Textarea
                      id="body"
                      defaultValue=""
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
                  <Button type="submit" className="w-full">Post</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Carousel items={cards} initialScroll={0} />
        <Separator className="mt-6"/>
      </div>

      <div className="pt-[2rem] flex flex-col w-full h-full">
      {posts.map((post, index) => (
        <FeedPost
          key={post.id}
          {...post}
          upClicked={voteStatus[index].upClicked}
          downClicked={voteStatus[index].downClicked}
          handleUpClick={() => handleUpClick(index)}
          handleDownClick={() => handleDownClick(index)}
        />
      ))}
      </div>
    </>
  );
}

export { Feed };
