'use client'; // Ensure this is a Client Component

import React, { useState, useEffect } from 'react';
import FeedPost from '../../components/ui/post'; // Adjust path if needed
import CommentSection from '../../components/commentsection';
import SideBarLeft from '@/components/sidebar-left';
import SideBarRight from '@/components/sidebar-right';

// Simulating fetching post data using postId
const fetchPostById = (postId: number) => {
    const dummyPosts = [
        {
            id: 1,
            subreddit: 'nextjs',
            subredditImage: '/path-to-image.jpg',
            time: '10 minutes ago',
            title: 'How to build a Reddit clone in Next.js',
            content: 'This post explains how to build a Reddit clone using Next.js...',
            votes: 100,
            comments: 20,
            imageUrl: '/path-to-post-image.jpg',
        },
        {
            id: 2,
            subreddit: 'javascript',
            subredditImage: '/path-to-image2.jpg',
            time: '1 hour ago',
            title: 'JavaScript ES2023 Features',
            content: 'This post discusses the latest features in JavaScript ES2023...',
            votes: 200,
            comments: 50,
            imageUrl: null,
        },
    ];

    return dummyPosts.find((post) => post.id === postId); // Fetch a post matching postId
};

const PostPage = ({ params }: { params: { postId: string } }) => {
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        if (params.postId) {
            const postData = fetchPostById(Number(params.postId)); // Simulate fetching post by ID
            setPost(postData);
        }
    }, [params.postId]);

    if (!post) {
        return <p>Loading...</p>;
    }

    return (<>
        <div className="flex w-full h-screen">
            <div className="w-[18%] h-full fixed left-0 top-0">
                <SideBarLeft />
            </div>
            <div className="pt-32 w-[64%] ml-[18%] mr-[18%] p-[3rem] overflow-y-auto hide-scrollbar">
                <FeedPost
                    id={post.id}
                    subreddit={post.subreddit}
                    subredditImage={post.subredditImage}
                    time={post.time}
                    title={post.title}
                    content={post.content}
                    votes={post.votes}
                    comments={post.comments}
                    imageUrl={post.imageUrl}
                />

                {/* Display Comment Section */}
                <CommentSection postId={post.id} />
            </div>
            <div className="w-[18%] h-full fixed right-0 top-0">
                <SideBarRight />
            </div>
        </div>
    </>

    );
};

export default PostPage;
