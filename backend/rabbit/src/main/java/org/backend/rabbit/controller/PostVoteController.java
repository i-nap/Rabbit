package org.backend.rabbit.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.backend.rabbit.dto.VoteRequestDTO;
import org.backend.rabbit.services.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostVoteController {

    @Autowired
    private PostService postService;

    @PostMapping("/{postId}/vote")
    public ResponseEntity<Map<String, Object>> voteOnPost(
            @PathVariable Long postId,
            @RequestBody String rawJson) throws JsonProcessingException {
//        System.out.println("Received raw JSON: " + rawJson); // Log the raw JSON
        ObjectMapper mapper = new ObjectMapper();

        // Deserialize the raw JSON to DTO
        VoteRequestDTO voteRequest = mapper.readValue(rawJson, VoteRequestDTO.class);

        // Process the vote
        int newVoteCount = postService.voteOnPost(postId, voteRequest.getUserId(), voteRequest.isUpvote());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Vote registered successfully");
        response.put("newVoteCount", newVoteCount);

        return ResponseEntity.ok(response);
    }

}
