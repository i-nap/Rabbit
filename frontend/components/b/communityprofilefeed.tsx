
import FeedPost from "../ui/post"; 

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

export default function CommunityProfileFeed() {

    return (
        <>
        {/* Posts Section */}
      <div className="">
        {posts.map((post) => (
          <FeedPost key={post.id} {...post} />
        ))}
      </div>
        </>
    )
}