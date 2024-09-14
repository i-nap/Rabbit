package org.backend.rabbit.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // User who voted

    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment; // Comment that was voted on

    @Column(nullable = false)
    private boolean upvote; // true for upvote, false for downvote
}
