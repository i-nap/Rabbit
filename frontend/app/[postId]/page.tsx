'use client'; // Ensure this is a Client Component

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios for API calls
import FeedPost from '../../components/ui/post'; // Adjust path if needed
import CommentSection from '../../components/commentsection';
import SideBarLeft from '@/components/sidebar-left';
import SideBarRight from '@/components/sidebar-right';
import { UserRound } from 'lucide-react';

interface Post {
    userId: number;
    id: number;
    community: string;
    communityImage: string; // Accept string or null
    time: string;
    title: string;
    content: string;
    votes: number;
    comments: number;
    imageUrl?: string;
    username:string // Use string | undefined instead of just string
}


// Function to fetch post data by postId using Axios
const fetchPostById = async (postId: number) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`); // Adjust URL based on your API
        return response.data; // Assuming the API returns post data
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
};

const PostPage = ({ params }: { params: { postId: string } }) => {
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            if (params.postId) {
                const postData = await fetchPostById(Number(params.postId)); // Fetch the post from the database
                setPost(postData);
            }
        };
        loadPost();
    }, [params.postId]);

    if (!post) {
        return <p>Loading...</p>; // Show loading state while fetching the post
    }

    return (
        <>
            <div className="flex w-full h-screen">
                <div className="w-[18%] h-full fixed left-0 top-0">
                    <SideBarLeft />
                </div>
                <div className="pt-32 w-[64%] ml-[18%] mr-[18%] p-[3rem] overflow-y-auto hide-scrollbar">
                    {/* Render the post details */}
                    <FeedPost
                        userId={2} // Replace with actual user ID
                        id={post.id}
                        community={post.community}
                        communityImage={post.communityImage}
                        time={post.time}
                        title={post.title}
                        content={post.content}
                        votes={post.votes}
                        comments={post.comments}
                        imageUrl={post.imageUrl || undefined}
                        username={post.username} // Convert null to undefined
                    />

                    {/* Display Comment Section */}
                    <CommentSection postId={String(post.id)} /> {/* Convert number to string */}
                </div>
                <div className="w-[18%] h-full fixed right-0 top-0">
                    <SideBarRight />
                </div>
            </div>
        </>
    );
};

export default PostPage;