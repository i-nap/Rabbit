'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import FeedPost from "../ui/post";
import { useParams } from 'next/navigation'; // To get the communityName from the URL

export default function CommunityProfileFeed() {
  const [posts, setPosts] = useState<any[]>([]); // State to store fetched posts
  const { communityName } = useParams(); // Get community name from the URL
  const [loading, setLoading] = useState<boolean>(true); // To show a loading state

  // Fetch posts from the backend using communityName
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/${communityName}/posts`);
      setPosts(response.data); // Assuming the API returns an array of posts
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts when the component mounts or when communityName changes
  useEffect(() => {
    if (communityName) {
      fetchPosts();
    }
  }, [communityName]);

  if (loading) {
    return <div>Loading posts...</div>; // Show a loading state
  }

  if (posts.length === 0) {
    return <div>No posts found for this community.</div>; // Show a message if no posts are found
  }

  return (
    <>
      {/* Posts Section */}
      <div className="">
        {posts.map((post) => (
          <FeedPost key={post.id} {...post} />
        ))}
      </div>
    </>
  );
}
