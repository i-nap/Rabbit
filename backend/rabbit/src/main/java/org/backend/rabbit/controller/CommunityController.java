package org.backend.rabbit.controller;

import org.backend.rabbit.dto.CommunityDTO;
import org.backend.rabbit.services.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @PostMapping("/createCommunity")
    public ResponseEntity<Map<String, String>> createCommunity(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("tags") List<String> tags,
            @RequestParam("links") String links,
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {

        Map<String, String> response = new HashMap<>();

        try {
            // Create a DTO to pass data to the service layer
            CommunityDTO communityDto = new CommunityDTO();
            communityDto.setName(name);
            communityDto.setDescription(description != null ? description : "");
            communityDto.setTags(tags);
            communityDto.setLinks(links);

            // Handle optional logo file
            if (logo != null && !logo.isEmpty()) {
                String logoUrl = "/uploads/logo/" + logo.getOriginalFilename();
                communityDto.setLogoUrl(logoUrl);
            } else {
                communityDto.setLogoUrl(""); // Fallback to no logo
            }

            // Handle optional cover image file
            if (coverImage != null && !coverImage.isEmpty()) {
                String coverImageUrl = "/uploads/cover/" + coverImage.getOriginalFilename();
                communityDto.setCoverImageUrl(coverImageUrl);
            } else {
                communityDto.setCoverImageUrl(""); // Fallback to no cover image
            }

            // Call the service to create the community
            communityService.createCommunity(communityDto);

            // Return success message
            response.put("message", "Community created successfully");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // Return a 400 Bad Request with a clear message if the community name already exists
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            // Return a 500 Internal Server Error with a generic error message
            response.put("message", "Error creating community");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

