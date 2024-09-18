package org.backend.rabbit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.backend.rabbit.model.Comment;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDTO {
    private Long postId;
    private String text;
    private Long parentId;
    private String userEmail;  // Make sure this matches what is sent from the frontend


    // Getters and setters

    // Method to map CommentRequest to Comment entity
    public Comment toComment() {
        Comment comment = Comment.builder()
                .text(this.text)
                .build();

        if (this.parentId != null) {
            comment.setParentComment(Comment.builder().id(parentId).build());
        }

        return comment;
    }
}
