package org.backend.rabbit.controller;

import org.backend.rabbit.dto.CommunityDTO;
import org.backend.rabbit.dto.UserDTO;
import org.backend.rabbit.model.Community;
import org.backend.rabbit.model.User;
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
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestParam("userId") Long userId // Accept userId as a request parameter
    ) {

        Map<String, String> response = new HashMap<>();

        try {
            // Create a DTO to pass data to the service layer
            CommunityDTO communityDto = new CommunityDTO();
            communityDto.setName(name);
            communityDto.setDescription(description != null ? description : "");
            communityDto.setTags(tags);
            communityDto.setLinks(links);
            communityDto.setUserId(userId); // Set the userId

            // Call the service to create the community, passing the images
            communityService.createCommunity(communityDto, logo, coverImage);

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



    @GetMapping("/user/{userId}/createdCommunities")
    public ResponseEntity<List<CommunityDTO>> getUserCreatedCommunities(@PathVariable Long userId) {
        List<Community> communities = communityService.getCommunitiesByUserId(userId);
        List<CommunityDTO> communityDTOs = communities.stream()
                .map(community -> CommunityDTO.builder()
                        .name(community.getName())
                        .description(community.getDescription())
                        .tags(community.getTags())
                        .links(community.getLinks())
                        .logoUrl(community.getLogoUrl())
                        .coverImageUrl(community.getCoverImageUrl())
                        .userId(community.getCreatedBy().getId())
                        .build())
                .toList();

        return ResponseEntity.ok(communityDTOs);
    }


    @PostMapping("/{communityName}/join")
    public ResponseEntity<Map<String, String>> joinCommunity(
            @PathVariable String communityName,
            @RequestParam("userId") Long userId) {
        Map<String, String> response = new HashMap<>();
        try {
            communityService.subscribeToCommunity(userId, communityName);
            response.put("message", "Joined the community successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error joining community");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Fetch community details by community name
    @GetMapping("/{communityName}")
    public ResponseEntity<CommunityDTO> getCommunityDetails(@PathVariable String communityName) {
        try {
            CommunityDTO community = communityService.getCommunityByName(communityName);
            System.out.println(community);
            return ResponseEntity.ok(community);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{communityName}/isCreator")
    public ResponseEntity<Map<String, Boolean>> isCreator(
            @PathVariable String communityName,
            @RequestParam Long userId
    ) {
        boolean isCreator = communityService.isUserCreator(communityName, userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isCreator", isCreator);
        return ResponseEntity.ok(response);
    }


    // Endpoint to leave a community
    @PostMapping("/{communityName}/leave")
    public ResponseEntity<Map<String, String>> leaveCommunity(
            @PathVariable String communityName,
            @RequestParam("userId") Long userId) {

        Map<String, String> response = new HashMap<>();
        try {
            communityService.unsubscribeFromCommunity(userId, communityName);
            response.put("message", "Left the community successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error leaving community");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    @GetMapping("/{communityName}/isJoined")
    public ResponseEntity<Map<String, Boolean>> isJoined(
            @PathVariable String communityName,
            @RequestParam Long userId
    ) {
        boolean isJoined = communityService.isUserSubscribed(communityName, userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isJoined", isJoined);
        return ResponseEntity.ok(response);
    }

    // Edit Community Details (PUT)
    @PutMapping("/edit")
    public ResponseEntity<Map<String, String>> editCommunity(
            @RequestParam("name") String communityName,
            @RequestParam("newName") String newCommunityName,
            @RequestParam("description") String description,
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        try {
            // Prepare a DTO for the edit operation
            CommunityDTO communityDto = new CommunityDTO();
            communityDto.setName(communityName);
            communityDto.setDescription(description);
            communityDto.setNewName(newCommunityName);

            // Call the service layer to handle the logic for image uploads
            if (logo != null && !logo.isEmpty()) {
                String logoUrl = communityService.saveImage(logo, "logo");  // Save logo and return URL
                communityDto.setLogoUrl(logoUrl);
            }

            if (coverImage != null && !coverImage.isEmpty()) {
                String coverImageUrl = communityService.saveImage(coverImage, "cover");  // Save cover image and return URL
                communityDto.setCoverImageUrl(coverImageUrl);
            }

            // Call the service layer to update the community
            communityService.updateCommunity(communityDto);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Community updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error updating community: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{communityName}/members")
    public ResponseEntity<List<UserDTO>> getCommunityMembers(@PathVariable String communityName) {
        System.out.println("Received request for members of community: " + communityName);  // Add logging

        try {
            // Fetch members using the community name
            List<User> members = communityService.getCommunityMembers(communityName);

            // Convert each User entity to UserDTO
            List<UserDTO> memberDTOs = members.stream()
                    .map(user -> UserDTO.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .username(user.getUsername())
                            .profilePictureUrl(user.getProfilePictureUrl())  // Assume this exists
                            .build())
                    .toList();

            // Return the list of UserDTOs
            return ResponseEntity.ok(memberDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @DeleteMapping("/{communityName}/remove-member/{memberId}")
    public ResponseEntity<?> removeMemberFromCommunity(
            @PathVariable String communityName,
            @PathVariable Long memberId) {
        try {
            communityService.removeMember(communityName, memberId);
            return ResponseEntity.ok().body("Member removed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Fetch subscribed communities by userId
    @GetMapping("/subscribed/{userId}")
    public ResponseEntity<List<CommunityDTO>> getSubscribedCommunities(@PathVariable Long userId) {
        List<CommunityDTO> subscribedCommunities = communityService.getSubscribedCommunities(userId);
        if (subscribedCommunities.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(subscribedCommunities);
    }


    // Search communities by keyword (name, description, or tags)
    @GetMapping("/search")
    public ResponseEntity<List<CommunityDTO>> searchCommunities(@RequestParam("keyword") String keyword) {
        try {
            List<CommunityDTO> communities = communityService.searchCommunities(keyword);
            return ResponseEntity.ok(communities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/random")
    public List<CommunityDTO> getRandomCommunities() {
        return communityService.getRandomCommunities(5); // Fetch 5 random communities
    }

//
//    // Fetch Community Notifications (GET)
//    @GetMapping("/{communityName}/notifications")
//    public ResponseEntity<List<String>> getCommunityNotifications(@PathVariable String communityName) {
//        try {
//            List<String> notifications = communityService.getCommunityNotifications(communityName);
//            return ResponseEntity.ok(notifications);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
}

