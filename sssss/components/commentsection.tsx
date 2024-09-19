import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store'; // Import the RootState type
import { Button } from './ui/button'; // Assuming you have a Button component
import { Textarea } from './ui/textarea'; // Assuming you have a Textarea component
import post from './ui/post';

interface Comment {
    id: string;
    postId: string;
    parentId: string | null;
    username: string;
    text: string;
    createdAt: string;
    votes: number;
    upClicked: boolean;
    downClicked: boolean;
}

interface CommentSectionProps {
    postId: string;
}
import axios from 'axios'; // Import Axios

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState<string>('');
    const [mainCommentError, setMainCommentError] = useState('');
    const [replyError, setReplyError] = useState('');

    // Fetch user information from Redux
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    // Fetch comments for the post when the component loads
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
                console.log("Fetched Comments:", response.data);  // Log to see the structure

                setComments(response.data); // Assuming the API returns the comment array
            } catch (error) {
                console.error('Failed to fetch comments:', error);
                setComments([]); // Set an empty array on error
            }
        };
        fetchComments();
    }, [postId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        setMainCommentError(''); // Clear error when user starts typing
    };

    const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReplyContent(e.target.value);
        setReplyError(''); // Clear error when user starts typing
    };

    const validateComment = () => {
        if (!newComment.trim()) {
            setMainCommentError('Comment cannot be empty');
            return false;
        }
        return true;
    };

    const validateReply = () => {
        if (!replyContent.trim()) {
            setReplyError('Reply cannot be empty');
            return false;
        }
        return true;
    };

    const handleCommentSubmit = async () => {
        if (!userInfo) {
            console.error('User is not logged in');
            return;
        }
    
        const commentData = {
            postId: Number(postId),
            text: replyTo ? replyContent : newComment,
            parentId: replyTo,
            userEmail: userInfo.email,
        };
    
        try {
            const response = await axios.post('http://localhost:8080/api/comments/create', commentData);
            setComments([...comments, response.data]);
            setNewComment('');
            setReplyContent('');
            setReplyTo(null);
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };
    
    // Use Axios to vote on a comment
    const handleVote = async (commentId: string, direction: 'up' | 'down') => {
        const voteData = { isUpvote: direction === 'up' };

        try {
            const response = await axios.post(`http://localhost:8080/api/comments/${commentId}/vote`, voteData);
            setComments(comments.map((comment) =>
                comment.id === response.data.id ? response.data : comment
            ));
        } catch (error) {
            console.error('Failed to vote on comment:', error);
        }
    };

    const renderComments = (comments: Comment[], parentId: string | null = null) => {
        if (!Array.isArray(comments)) {
            return null; // Safeguard to ensure comments is an array
        }

        return (
            <div className={parentId ? "ml-5 pl-4 border-l-2 border-gray-300" : ""}>
                {comments.filter(comment => comment.parentId === parentId).map((comment) => (<div key={comment.id} className="pb-4 mb-4">
                    <div className="text-sm text-gray-600">
                        <button
                            onClick={() => handleVote(comment.id, 'up')}
                            className={`mr-2 ${comment.upClicked ? 'text-green-600' : 'hover:text-green-600'}`}>
                            ↑
                        </button>
                        <button
                            onClick={() => handleVote(comment.id, 'down')}
                            className={`${comment.downClicked ? 'text-red-600' : 'hover:text-red-600'}`}>
                            ↓
                        </button>
                        <span className="ml-2">{comment.votes} points</span> by {comment.username} at {new Date(comment.createdAt).toLocaleString()}
                    </div>
                    <p>{comment.text}</p>
                    <button
                        onClick={() => setReplyTo(comment.id)}
                        className="text-sm text-blue-600 hover:underline">
                        Reply
                    </button>
                    {replyTo === comment.id && (
                        <div className="mt-2 mb-2">
                            <Textarea
                                value={replyContent}
                                onChange={handleReplyChange}
                                placeholder="Write a reply..."
                                className={`block w-full p-2 border ${replyContent === '' && replyError ? 'border-red-600' : 'border-gray-300'} rounded-md mb-2`}
                            />
                            {replyError && <p className="text-red-600 text-sm">{replyError}</p>}
                            <Button onClick={handleCommentSubmit}>Submit Reply</Button>
                        </div>
                    )}
                    {renderComments(comments, comment.id)}
                </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
                <Textarea
                    value={newComment}
                    onChange={handleInputChange}
                    placeholder="Write a comment..."
                    className={`block w-full p-2 border ${newComment === '' && mainCommentError ? 'border-red-600' : 'border-gray-300'} rounded-md mb-2`}
                />
                {mainCommentError && <p className="text-red-600 text-sm">{mainCommentError}</p>}
                <Button onClick={handleCommentSubmit}>Post Comment</Button>
            </div>

            {renderComments(comments)}
        </div>
    );
};

export default CommentSection;
