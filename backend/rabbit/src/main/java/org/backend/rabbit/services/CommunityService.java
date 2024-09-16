package org.backend.rabbit.services;

import org.backend.rabbit.dto.CommunityDTO;
import org.backend.rabbit.model.Community;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.CommunityRepository;
import org.backend.rabbit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        // Create and save the new community if it doesn't exist
        Community community = new Community();
        community.setName(communityDto.getName());
        community.setDescription(communityDto.getDescription());
        community.setLogoUrl(communityDto.getLogoUrl());
        community.setCoverImageUrl(communityDto.getCoverImageUrl());
        community.setTags(communityDto.getTags());
        community.setLinks(communityDto.getLinks());

        communityRepository.save(community);
    }

    // Method to subscribe a user to a community
    public void subscribeToCommunity(Long userId, Long communityId) {
        // Fetch the user and community entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Community community = communityRepository.findById(communityId)
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
    public void unsubscribeFromCommunity(Long userId, Long communityId) {
        // Fetch the user and community entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));

        // Check if the user is subscribed to the community
        if (user.getSubscribedCommunities().contains(community)) {
            user.getSubscribedCommunities().remove(community);
            userRepository.save(user);  // Save the updated user entity after unsubscribing
        } else {
            throw new IllegalArgumentException("User is not subscribed to this community.");
        }
    }
}