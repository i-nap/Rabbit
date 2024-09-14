package org.backend.rabbit.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class VoteRequestDTO {
    private Long userId;
    @JsonProperty("isUpvote") // This maps the "isUpvote" field in the JSON to "upvote"
    private boolean upvote; // The field can remain "upvote" in Java}
}
