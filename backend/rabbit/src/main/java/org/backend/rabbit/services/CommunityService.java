package org.backend.rabbit.services;

import org.backend.rabbit.dto.CommunityDTO;
import org.backend.rabbit.model.Community;
import org.backend.rabbit.repository.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CommunityService {

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
}