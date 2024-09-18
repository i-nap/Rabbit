package org.backend.rabbit.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.backend.rabbit.model.Comment;

import java.time.format.DateTimeFormatter;
@Data
public class CommentDTO {
    private Long id;
    private String text;
    private Long postId;
    private Long parentId;
    private String username;

    @Setter
    @Getter
    private String createdAt; // Add this line

    public CommentDTO(Comment comment) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        this.id = comment.getId();
        this.text = comment.getText();
        this.postId = comment.getPost().getId();
        this.parentId = comment.getParentComment() != null ? comment.getParentComment().getId() : null;
        this.username = comment.getUser().getUsername(); // Correcting the email assignment
        this.createdAt = formatter.format(comment.getCreatedAt()); // Format the Instant to String
    }

}
