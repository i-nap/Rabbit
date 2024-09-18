package org.backend.rabbit.services;

import org.backend.rabbit.dto.CommentDTO;
import org.backend.rabbit.model.Comment;
import org.backend.rabbit.model.CommentVote;
import org.backend.rabbit.model.Post;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.CommentRepository;
import org.backend.rabbit.repository.CommentVoteRepository;
import org.backend.rabbit.repository.PostRepository;
import org.backend.rabbit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CommentVoteRepository voteRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommentService(PostRepository postRepository, CommentRepository commentRepository, CommentVoteRepository voteRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
    }

    // Fetch comments by postId and return as CommentDTO
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(CommentDTO::new)  // Convert each Comment to CommentDTO
                .collect(Collectors.toList());
    }

    // Create a new comment and return the DTO
    public CommentDTO createComment(Comment comment, Long postId, String userEmail) {
        // Fetch the Post entity by ID
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Post not found");
        }

        // Fetch the User entity by email
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        // Set the post and user on the comment
        Post post = postOptional.get();
        User user = userOptional.get();
        comment.setPost(post);
        comment.setUser(user);

        // Save the comment and return it as a DTO
        Comment savedComment = commentRepository.save(comment);
        return new CommentDTO(savedComment);  // Convert to DTO before returning
    }

    // Voting logic, returning CommentDTO
    public CommentDTO voteOnComment(Long commentId, CommentVote vote) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        vote.setComment(comment);
        voteRepository.save(vote);
        comment.getVotes().add(vote);

        Comment updatedComment = commentRepository.save(comment);
        return new CommentDTO(updatedComment);  // Return the updated comment as a DTO
    }
}
