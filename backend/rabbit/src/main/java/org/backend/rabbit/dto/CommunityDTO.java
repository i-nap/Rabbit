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
    private String name;
    private String description;
    private List<String> tags;
    private String links;
    private String logoUrl;
    private String coverImageUrl;

}