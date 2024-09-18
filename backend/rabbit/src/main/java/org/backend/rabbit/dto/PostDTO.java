package org.backend.rabbit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}
