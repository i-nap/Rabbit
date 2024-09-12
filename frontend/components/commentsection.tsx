import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface Comment {
    id: string;
    postId: string;
    parentId: string | null;
    author: string;
    text: string;
    createdAt: string;
    votes: number;
    upClicked: boolean;
    downClicked: boolean;
}

interface CommentSectionProps {
    postId: string;
}

const initialComments: Comment[] = [
    {
        id: '1',
        postId: 'post1',
        parentId: null,
        author: 'User1',
        text: 'This is a dummy comment!',
        createdAt: new Date().toISOString(),
        votes: 15,
        upClicked: false,
        downClicked: false,
    },
    {
        id: '2',
        postId: 'post1',
        parentId: '1',
        author: 'User2',
        text: 'This is a nested reply!',
        createdAt: new Date().toISOString(),
        votes: 7,
        upClicked: false,
        downClicked: false,
    },
];

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState<string>('');
    const [mainCommentError, setMainCommentError] = useState('');
    const [replyError, setReplyError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        setMainCommentError(''); // Clear error when user starts typing
    };

    const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReplyContent(e.target.value);
        setReplyError(''); // Clear error when user starts typing
    };

    const handleCommentSubmit = () => {
        if (!newComment && !replyTo) {
            setMainCommentError('Comment cannot be empty');
            return;
        }
        if (replyTo && !replyContent) {
            setReplyError('Reply cannot be empty');
            return;
        }

        const newCommentData: Comment = {
            id: `${comments.length + 1}`,
            postId: postId,
            parentId: replyTo,
            author: 'New User',
            text: replyTo ? replyContent : newComment,
            createdAt: new Date().toISOString(),
            votes: 0,
            upClicked: false,
            downClicked: false,
        };

        setComments([...comments, newCommentData]);
        setNewComment('');
        setReplyContent('');
        setReplyTo(null);
        setMainCommentError('');
        setReplyError('');
    };

    const handleVote = (id: string, direction: 'up' | 'down') => {
        setComments(comments.map(comment => {
            if (comment.id === id) {
                let newVotes = comment.votes;
                let { upClicked, downClicked } = comment;

                if (direction === 'up') {
                    if (upClicked) {
                        newVotes -= 1;
                        upClicked = false;
                    } else {
                        newVotes += downClicked ? 2 : 1;
                        upClicked = true;
                        downClicked = false;
                    }
                } else if (direction === 'down') {
                    if (downClicked) {
                        newVotes += 1;
                        downClicked = false;
                    } else {
                        newVotes -= upClicked ? 2 : 1;
                        downClicked = true;
                        upClicked = false;
                    }
                }

                return { ...comment, votes: newVotes, upClicked, downClicked };
            }
            return comment;
        }));
    };
    const renderComments = (comments: Comment[], parentId: string | null = null) => {
        return (
            <div className={parentId ? "ml-5 pl-4 border-l-2 border-gray-300" : ""}>
                {comments.filter(comment => comment.parentId === parentId).map((comment) => (
                    <div key={comment.id} className="pb-4 mb-4">
                        <div className="text-sm text-gray-600">
                            <button onClick={() => handleVote(comment.id, 'up')} className={`mr-2 ${comment.upClicked ? 'text-green-600' : 'hover:text-green-600'}`}>↑</button>
                            <button onClick={() => handleVote(comment.id, 'down')} className={`${comment.downClicked ? 'text-red-600' : 'hover:text-red-600'}`}>↓</button>
                            <span className="ml-2">{comment.votes} points</span> by {comment.author} at {new Date(comment.createdAt).toLocaleTimeString()}
                        </div>
                        <p>{comment.text}</p>
                        <button onClick={() => setReplyTo(comment.id)} className="text-sm text-blue-600 hover:underline">Reply</button>
                        {replyTo === comment.id && (
                            <div className="mt-2 mb-2">
                                <div className='mb-2'><Textarea
                                    value={replyContent} onChange={handleReplyChange} placeholder="Write a reply..."
                                    className={`block w-full p-2 border ${replyContent === '' && replyError ? 'border-red-600' : 'border-gray-300'} rounded-md mb-2`}
                                />
                                {replyError && <p className="text-red-600 text-sm">{replyError}</p>}</div>

                                

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
        <div className='flex flex-col space-y-[2rem]'>
            <div className='flex flex-col space-y-2'>
                <div className='flex flex-col'>
                <Textarea
                    value={newComment} onChange={handleInputChange} placeholder="Write a comment..."
                    className={`block w-full p-2 border ${newComment === '' && mainCommentError ? 'border-red-600' : 'border-gray-300'} rounded-md mb-2`}
                />
                {mainCommentError && <p className="text-red-600 text-sm">{mainCommentError}</p>}
                </div>
                
                <Button onClick={handleCommentSubmit} className='w-[6rem]'>Post</Button>
            </div>

            {renderComments(comments)}
        </div>
    );
};

export default CommentSection;
