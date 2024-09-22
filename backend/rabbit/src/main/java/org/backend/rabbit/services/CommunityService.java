package org.backend.rabbit.services;

import org.backend.rabbit.dto.CommunityDTO;
import org.backend.rabbit.model.Community;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.CommunityRepository;
import org.backend.rabbit.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommunityRepository communityRepository;
    private final String uploadDirectory = "C:/uploads/community-pictures/";  // Choose a permanent directory

    private static final Logger logger = LoggerFactory.getLogger(CommunityService.class);
    public void createCommunity(CommunityDTO communityDto, MultipartFile logo, MultipartFile coverImage) {
        try {
            logger.info("Starting the creation of a community...");

            // Check if a community with the same name already exists
            Optional<Community> existingCommunity = communityRepository.findByName(communityDto.getName());
            if (existingCommunity.isPresent()) {
                throw new IllegalArgumentException("Community with this name already exists");
            }

            // Fetch the user by userId
            User user = userRepository.findById(communityDto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            logger.info("User found: " + user.getUsername());

            // Create and save the new community
            Community community = new Community();
            community.setName(communityDto.getName());
            community.setDescription(communityDto.getDescription());

            // Handle logo image
            if (logo != null && !logo.isEmpty()) {
                String logoUrl = saveImage(logo, "logo"); // Save the image and get its URL
                community.setLogoUrl(logoUrl);
            }

            // Handle cover image
            if (coverImage != null && !coverImage.isEmpty()) {
                String coverImageUrl = saveImage(coverImage, "cover"); // Save the image and get its URL
                community.setCoverImageUrl(coverImageUrl);
            }

            community.setTags(communityDto.getTags());
            community.setLinks(communityDto.getLinks());
            community.setCreatedBy(user);

            logger.info("Creating community: " + community.getName());

            // Ensure subscribers list is initialized
            if (community.getSubscribers() == null) {
                community.setSubscribers(new ArrayList<>()); // Initialize if not done
            }

            // Add the user as the first subscriber
            community.getSubscribers().add(user);

            // Add the community to the user's subscribed communities
            if (user.getSubscribedCommunities() == null) {
                user.setSubscribedCommunities(new ArrayList<>());
            }
            user.getSubscribedCommunities().add(community);

            // Save the community and the updated user
            communityRepository.save(community);
            userRepository.save(user); // Save to update the user's subscriptions

            logger.info("Community created successfully!");

        } catch (IllegalArgumentException e) {
            // Handle specific IllegalArgumentException (like duplicate community name or user not found)
            logger.error("Error: {}", e.getMessage(), e);
            throw new RuntimeException("Error: " + e.getMessage());

        } catch (Exception e) {
            // Handle any other unforeseen errors
            logger.error("Unexpected error occurred: ", e);
            throw new RuntimeException("An unexpected error occurred while creating the community.");
        }
    }

    public String saveImage(MultipartFile file, String type) throws IOException {
        // Generate a unique file name using UUID
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + "." + fileExtension;

        // Define where to store the images (based on the type: logo or cover)
        String folder = type.equals("logo") ? "/uploads/logo/" : "/uploads/cover/";

        // Create the directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDirectory + folder);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath); // Create the directory if it doesn't exist
        }

        // Save the file locally
        Path filePath = uploadPath.resolve(fileName);
        file.transferTo(filePath.toFile());

        // Return the relative URL for saving in the database
        return "http://localhost:8080/uploads/community-pictures" + folder + fileName;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "jpg"; // Default extension if none is found
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }




    public List<Community> getCommunitiesByUserId(Long userId) {
        return communityRepository.findByCreatedById(userId);
    }


    // Method to subscribe a user to a community
    public void subscribeToCommunity(Long userId, String communityName) {
        // Fetch the user and community entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Community community = communityRepository.findByName(communityName)
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));

        // Check if the user is already subscribed to the community
        if (!user.getSubscribedCommunities().contains(community)) {
            user.getSubscribedCommunities().add(community);
            userRepository.save(user);  // Save the updated user entity with the new subscription
        } else {
            throw new IllegalArgumentException("User is already subscribed to this community.");
        }
    }

    // Method to unsubscribe a user from a community
    public void unsubscribeFromCommunity(Long userId, String communityName) {
        // Fetch the user and community entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Community community = communityRepository.findByName(communityName)
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));

        // Check if the user is subscribed to the community
        if (user.getSubscribedCommunities().contains(community)) {
            user.getSubscribedCommunities().remove(community);
            userRepository.save(user);  // Save the updated user entity after unsubscribing
        } else {
            throw new IllegalArgumentException("User is not subscribed to this community.");
        }
    }

    // Method to check if a user is subscribed to a community
    public boolean isUserSubscribed(String communityName, Long userId) {
        // Fetch the community by name
        Optional<Community> community = communityRepository.findByName(communityName);

        if (community.isPresent()) {
            // Fetch the user by userId
            Optional<User> user = userRepository.findById(userId);

            if (user.isPresent()) {
                // Check if the user is in the list of subscribed users for the community
                return community.get().getSubscribers().contains(user.get());
            }
        }

        // Return false if community or user is not found, or if the user is not subscribed
        return false;
    }

    public boolean isUserCreator(String communityName, Long userId) {
        Optional<Community> communityOptional = communityRepository.findByName(communityName);

        // Check if the community exists
        if (communityOptional.isPresent()) {
            Community community = communityOptional.get(); // Get the actual community object

            // Check if the creator's userId matches the provided userId
            return community.getCreatedBy().getId().equals(userId);
        }

        // If the community is not found, return false
        return false;
    }

    // Update Community Details
    public void updateCommunity(CommunityDTO communityDto) {
        // No recursive calls here
        Optional<Community> existingCommunity = communityRepository.findByName(communityDto.getName());
        if (existingCommunity.isEmpty()) {
            throw new IllegalArgumentException("Community not found.");
        }
        System.out.println(communityDto);
        Community community = existingCommunity.get();
        if (communityDto.getDescription() != null && !communityDto.getDescription().isEmpty()) {
            community.setDescription(communityDto.getDescription());
        }

        if (communityDto.getNewName() != null && !communityDto.getNewName().isEmpty()) {
            community.setName(communityDto.getNewName());  // Update name with new name
        }

        // Update logo and cover image only if provided
        if (communityDto.getLogoUrl() != null && !communityDto.getLogoUrl().isEmpty()) {
            community.setLogoUrl(communityDto.getLogoUrl());
        }
        if (communityDto.getCoverImageUrl() != null && !communityDto.getCoverImageUrl().isEmpty()) {
            community.setCoverImageUrl(communityDto.getCoverImageUrl());
        }

        // Save the updated community
        communityRepository.save(community);
    }



    // Get Community Members
    public List<User> getCommunityMembers(String communityName) throws IllegalArgumentException {
        Community community = communityRepository.findByName(communityName)
                .orElseThrow(() -> new IllegalArgumentException("Community not found."));

        return community.getSubscribers();
    }

    public void removeMember(String communityName, Long memberId) {
        Community community = communityRepository.findByName(communityName)
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));

        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        // Remove member from community's subscribers
        boolean removedFromCommunity = community.getSubscribers().remove(member);

        // Remove community from user's subscribed communities
        boolean removedFromUser = member.getSubscribedCommunities().remove(community);

        if (removedFromCommunity && removedFromUser) {
            // Persist changes to both entities
            communityRepository.save(community);
            userRepository.save(member);
        } else {
            throw new IllegalArgumentException("Failed to remove user from community or user not subscribed");
        }
    }

    // Get community details by name
    public CommunityDTO getCommunityByName(String name) {
        Community community = communityRepository.findByName(name).orElseThrow(() -> new RuntimeException("Community not found"));
        return new CommunityDTO(community.getName(), community.getDescription(), community.getLogoUrl(), community.getCoverImageUrl(), community.getTags(), community.getCreatedBy().getId(),community.getLinks());
    }

    // Fetch communities subscribed by the user and map to DTOs
    public List<CommunityDTO> getSubscribedCommunities(Long userId) {
        List<Community> communities = communityRepository.findSubscribedCommunitiesByUserId(userId);

        return communities.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Helper method to map Community to CommunityDTO
    private CommunityDTO mapToDTO(Community community) {
        return CommunityDTO.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .logoUrl(community.getLogoUrl())
                .coverImageUrl(community.getCoverImageUrl())
                .tags(community.getTags())
                .links(community.getLinks())
                .userId(community.getCreatedBy().getId())  // Assuming you want the creator's userId
                .build();
    }


    // Method to convert Community entity to CommunityDTO
    public CommunityDTO toCommunityDTO(Community community) {
        return new CommunityDTO(
                community.getId(),
                community.getName(),
                community.getDescription(),
                community.getTags(),
                community.getLinks(),
                community.getLogoUrl(),
                community.getCoverImageUrl(),
                community.getCreatedBy().getId(), // Assuming you want the ID of the user who created it
                community.getName() // Assuming you're using `newName` as the community name for now
        );
    }
    // Sear
    // ch for communities based on keyword (name, description, or tags)
    public List<CommunityDTO> searchCommunities(String keyword) {
        List<Community> communities = communityRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrTagsContaining(keyword, keyword, keyword);

        return communities.stream()
                .map(this::toCommunityDTO)
                .collect(Collectors.toList());
    }

    public List<CommunityDTO> getRandomCommunities(int count) {
        List<Community> communities = communityRepository.findRandomCommunities(PageRequest.of(0, count)).getContent();
        return communities.stream()
                .map(community -> new CommunityDTO(community.getId(), community.getName(), community.getLogoUrl()))
                .collect(Collectors.toList());
    }

//    // Get Community Notifications
//    public List<String> getCommunityNotifications(String communityName) throws IllegalArgumentException {
//        Community community = communityRepository.findByName(communityName)
//                .orElseThrow(() -> new IllegalArgumentException("Community not found."));
//
//        // Example: Assuming community has a list of notifications
//        return community.getNotifications();
//    }

}
