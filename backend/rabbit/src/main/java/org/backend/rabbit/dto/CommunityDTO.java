package org.backend.rabbit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommunityDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> tags;
    private String links;
    private String logoUrl;
    private String coverImageUrl;
    private Long userId;
    private String newName;
    public CommunityDTO(String name, String description, String logoUrl, String coverImageUrl, List<String> tags, Long createdBy,String links) {
        this.name = name;
        this.description = description;
        this.logoUrl = logoUrl;
        this.coverImageUrl = coverImageUrl;
        this.tags = tags;
        this.links = links;
    }
    // Add a constructor that takes id, name, and logoUrl
    public CommunityDTO(Long id, String name, String logoUrl) {
        this.id = id;
        this.name = name;
        this.logoUrl = logoUrl;
    }
}