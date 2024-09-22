package org.backend.rabbit.services;

import org.backend.rabbit.dto.PostCreationDTO;
import org.backend.rabbit.dto.PostDTO;
import org.backend.rabbit.model.Community;
import org.backend.rabbit.model.Post;
import org.backend.rabbit.model.PostVote;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.CommunityRepository;
import org.backend.rabbit.repository.PostRepository;
import org.backend.rabbit.repository.PostVoteRepository;
import org.backend.rabbit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private PostVoteRepository postVoteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    private final String uploadDirectory = "C:/uploads/";  // Choose a permanent directory

    // Fetch posts for a specific community and return them as PostDTOs
    public List<PostDTO> getPostsByCommunity(String communityName) {
        List<Post> posts = postRepository.findByCommunity_Name(communityName);
        return posts.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Map Post entity to PostDTO
    private PostDTO mapToDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .community(post.getCommunity().getName())
                .communityImage(post.getCommunity().getLogoUrl()) // Assuming logo URL is stored in Community
                .time(formatTime(post.getCreatedAt())) // Format Instant to a readable time format
                .title(post.getTitle())
                .content(post.getContent())
                .votes(post.getVotes())
                .comments(post.getComments().size()) // Count the comments
                .username(post.getUser().getUsername()) // Expose the username of the post creator
                .imageUrl(post.getImageUrl()) // Optional image URL for the post
                .userId(post.getUser().getId()) // Add user ID
                .build();
    }

    // Helper method to format time
    private String formatTime(Instant createdAt) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
                .withZone(ZoneOffset.UTC);
        return formatter.format(createdAt);
    }

    public List<PostDTO> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .map(post -> new PostDTO(
                        post.getId(),
                        post.getCommunity().getName(),
                        post.getCommunity().getLogoUrl(),
                        post.getCreatedAt().toString(),
                        post.getTitle(),
                        post.getContent(),
                        post.getVotes(),
                        post.getComments().size(),
                        post.getUser().getUsername(),
                        post.getImageUrl(),
                        post.getUser().getId()))
                .collect(Collectors.toList());
    }
    public int voteOnPost(Long postId, Long userId, boolean isUpvote) {
        // Fetch the post and user entities
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // Check if the user has already voted on this post
        Optional<PostVote> existingVoteOpt = postVoteRepository.findByPostAndUser(post, user);

        if (existingVoteOpt.isPresent()) {
            PostVote existingVote = existingVoteOpt.get();
            if (existingVote.isUpvote() == isUpvote) {
                // The user is toggling the same vote (remove the vote)
                postVoteRepository.delete(existingVote);
                if (isUpvote) {
                    post.setVotes(Math.max(0, post.getVotes() - 1)); // Remove upvote
                } else {
                    post.setVotes(post.getVotes() + 1); // Remove downvote
                }
            } else {
                // User is switching votes (upvote to downvote or vice versa)
                existingVote.setUpvote(isUpvote);
                postVoteRepository.save(existingVote);
                if (isUpvote) {
                    post.setVotes(post.getVotes() + 2); // Switching from downvote to upvote
                } else {
                    post.setVotes(Math.max(0, post.getVotes() - 2)); // Switching from upvote to downvote
                }
            }
        } else {
            // User has not voted yet, so create a new vote
            PostVote newVote = new PostVote();
            newVote.setPost(post);
            newVote.setUser(user);
            newVote.setUpvote(isUpvote);
            postVoteRepository.save(newVote);
            if (isUpvote) {
                post.setVotes(post.getVotes() + 1); // First-time upvote
            } else {
                post.setVotes(Math.max(0, post.getVotes() - 1)); // First-time downvote
            }
        }

        // Save the updated post
        postRepository.save(post);

        // Return the updated vote count
        return post.getVotes();
    }

    public void createDummyPosts() {
        // Assuming there's a user and a community in the database
        User user = userRepository.findById(2L).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Community community = communityRepository.findById(1L).orElseThrow(() -> new IllegalArgumentException("Community not found"));

        // Create dummy posts
        Post post1 = Post.builder()
                .title("First Dummy Post")
                .content("This is the content of the first dummy post.")
                .user(user)
                .community(community)
                .votes(10)
                .imageUrl("https://picsum.photos/200")
                .createdAt(Instant.now())
                .build();

        Post post2 = Post.builder()
                .title("Second Dummy Post")
                .content("This is the content of the second dummy post.")
                .user(user)
                .community(community)
                .votes(20)
                .imageUrl("https://picsum.photos/200")
                .createdAt(Instant.now())
                .build();

        // Save dummy posts to the database
        postRepository.saveAll(List.of(post1, post2));
    }


    public void createPost(PostCreationDTO postDto, List<MultipartFile> images) {
        // Find the community by name
        Community community = communityRepository.findByName(postDto.getCommunity())
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));

        // Find the user by ID
        User user = userRepository.findById(postDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create the post entity
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getBody());
        post.setCommunity(community);
        post.setUser(user);
        post.setLinks(postDto.getLinks());
        post.setCreatedAt(Instant.now());

        // Save and process images if present
        if (images != null && !images.isEmpty()) {
            String imageUrls = saveImages(images);
            post.setImageUrl(imageUrls); // Set the image URL
        }

        // Save the post to the repository
        postRepository.save(post);
    }

    // Helper method to save images and return URLs as a comma-separated string (for multiple images)
    private String saveImages(List<MultipartFile> images) {
        StringBuilder imageUrls = new StringBuilder();

        for (MultipartFile image : images) {
            try {
                // Generate a unique filename for each image
                String fileExtension = getFileExtension(image.getOriginalFilename());
                String fileName = UUID.randomUUID().toString() + "." + fileExtension;

                // Create directories if they don't exist
                Path uploadPath = Paths.get(uploadDirectory, "post-images");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath); // Create directory if it does not exist
                }

                // Save the image file
                Path filePath = uploadPath.resolve(fileName);
                image.transferTo(filePath.toFile());

                // Append the image URL to the string builder
                String imageUrl = "http://localhost:8080/uploads/post-images/" + fileName;
                imageUrls.append(imageUrl).append(",");
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }

        // Return the image URLs (trimmed if necessary)
        return imageUrls.length() > 0 ? imageUrls.substring(0, imageUrls.length() - 1) : "";
    }

    // Helper method to extract file extension
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "jpg"; // Default to jpg if no extension found
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }
    // Method to find a post by its ID and return it as a PostDTO
    public PostDTO findPostById(Long postId) {
        // Fetch the post directly by ID
        return postRepository.findById(postId)
                .map(post -> new PostDTO(
                        post.getId(),
                        post.getCommunity().getName(), // Assuming Post has a Community object
                        post.getCommunity().getLogoUrl(),
                        post.getCreatedAt().toString(),
                        post.getTitle(),
                        post.getContent(),
                        post.getVotes(),
                        post.getComments().size(),
                        post.getUser().getUsername(),
                        post.getImageUrl(),
                        post.getUser().getId()))
                .orElse(null); // If post is not found, return null
    }

    public String getUserVoteStatus(Long postId, Long userId) {
        PostVote vote = postVoteRepository.findByPostIdAndUserId(postId, userId);
        if (vote == null) {
            return "none";  // No vote found
        } else if (vote.isUpvote()) {
            return "upvote";
        } else {
            return "downvote";
        }
    }

    // Fetch trending posts (could be based on time and number of votes)
    public List<PostDTO> getTrendingPosts() {
        List<Post> trendingPosts = postRepository.findTrendingPosts(); // Implement this query in PostRepository
        return trendingPosts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Fetch most liked posts (could be based on the number of votes)
    public List<PostDTO> getMostLikedPosts() {
        List<Post> mostLikedPosts = postRepository.findMostLikedPosts(); // Implement this query in PostRepository
        return mostLikedPosts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Fetch new posts (could be based on creation time)
    public List<PostDTO> getNewPosts() {
        List<Post> newPosts = postRepository.findNewPosts(); // Implement this query in PostRepository
        return newPosts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private PostDTO convertToDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setCommunity(post.getCommunity().getName());
        postDTO.setCommunityImage(post.getCommunity().getLogoUrl());
        postDTO.setTime(post.getCreatedAt().toString());
        postDTO.setTitle(post.getTitle());
        postDTO.setContent(post.getContent());
        postDTO.setVotes(post.getVotes());
        postDTO.setComments(post.getComments().size());
        postDTO.setUsername(post.getUser().getUsername());
        postDTO.setImageUrl(post.getImageUrl());
        return postDTO;
    }

}
