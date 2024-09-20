package org.backend.rabbit.services;

import org.backend.rabbit.dto.CommunityDTO;
import org.backend.rabbit.model.Community;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.CommunityRepository;
import org.backend.rabbit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommunityRepository communityRepository;
    public void createCommunity(CommunityDTO communityDto) {
        // Check if community with the same name already exists
        Optional<Community> existingCommunity = communityRepository.findByName(communityDto.getName());
        if (existingCommunity.isPresent()) {
            throw new IllegalArgumentException("Community with this name already exists");
        }

        // Fetch the user by userId
        User user = userRepository.findById(communityDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create and save the new community if it doesn't exist
        Community community = new Community();
        community.setName(communityDto.getName());
        community.setDescription(communityDto.getDescription());
        community.setLogoUrl(communityDto.getLogoUrl());
        community.setCoverImageUrl(communityDto.getCoverImageUrl());
        community.setTags(communityDto.getTags());
        community.setLinks(communityDto.getLinks());
        community.setCreatedBy(user); // Set the fetched User object
        List<User> subscribers = new ArrayList<>();
        subscribers.add(user);
        community.setSubscribers(subscribers); // Set the subscribers list
        communityRepository.save(community);
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
    public void updateCommunity(CommunityDTO communityDto) throws IllegalArgumentException {
        Optional<Community> existingCommunity = communityRepository.findByName(communityDto.getName());

        if (existingCommunity.isEmpty()) {
            throw new IllegalArgumentException("Community not found.");
        }

        Community community = existingCommunity.get();
        community.setName(communityDto.getName());
        community.setDescription(communityDto.getDescription());

        if (communityDto.getLogoUrl() != null && !communityDto.getLogoUrl().isEmpty()) {
            community.setLogoUrl(communityDto.getLogoUrl());
        }
        if (communityDto.getCoverImageUrl() != null && !communityDto.getCoverImageUrl().isEmpty()) {
            community.setCoverImageUrl(communityDto.getCoverImageUrl());
        }

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


//    // Get Community Notifications
//    public List<String> getCommunityNotifications(String communityName) throws IllegalArgumentException {
//        Community community = communityRepository.findByName(communityName)
//                .orElseThrow(() -> new IllegalArgumentException("Community not found."));
//
//        // Example: Assuming community has a list of notifications
//        return community.getNotifications();
//    }

}
