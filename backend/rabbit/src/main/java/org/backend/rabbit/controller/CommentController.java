package org.backend.rabbit.controller;

import org.backend.rabbit.dto.CommentDTO;
import org.backend.rabbit.dto.CommentRequestDTO;
import org.backend.rabbit.model.CommentVote;
import org.backend.rabbit.services.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Fetch comments for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/create")
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentRequestDTO commentRequest) {
        Long postId = commentRequest.getPostId();
        String userEmail = commentRequest.getUserEmail();  // Get userEmail from the request

        if (userEmail == null) {
            return ResponseEntity.badRequest().build();  // Handle the case where the email is null
        }

        // Create the comment using the CommentRequest DTO
        CommentDTO createdComment = commentService.createComment(commentRequest.toComment(), postId, userEmail);
        return ResponseEntity.ok(createdComment);
    }

    // Voting for a comment
    @PostMapping("/{commentId}/vote")
    public ResponseEntity<CommentDTO> voteOnComment(
            @PathVariable Long commentId,
            @RequestBody CommentVote vote) {
        CommentDTO updatedComment = commentService.voteOnComment(commentId, vote);
        return ResponseEntity.ok(updatedComment);
    }
}
