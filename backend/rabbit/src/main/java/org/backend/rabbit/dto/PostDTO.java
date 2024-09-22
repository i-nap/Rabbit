package org.backend.rabbit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.backend.rabbit.model.Post;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private Long id;
    private String community;
    private String communityImage;
    private String time;
    private String title;
    private String content;
    private int votes;
    private int comments;
    private String username;
    private String imageUrl;
    private Long userId; // Add this field
    // Constructor that accepts a Post entity
    public PostDTO(Post post) {
        this.id = post.getId();
        this.community = post.getCommunity().getName(); // Adjust if needed based on your entity relationships
        this.communityImage = post.getCommunity().getLogoUrl(); // Assuming the community has a logo URL
        this.time = post.getCreatedAt().toString(); // Convert to your preferred format
        this.title = post.getTitle();
        this.content = post.getContent();
        this.votes = post.getVotes();
        this.comments = post.getComments().size(); // Assuming Post has a comments list
        this.username = post.getUser().getUsername(); // Assuming the user who created the post has a username
        this.imageUrl = post.getImageUrl();
    }
}
