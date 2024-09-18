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

import java.time.Instant;
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
        // Find the community by ID or name
        Community community = communityRepository.findByName(postDto.getCommunity())
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));
        System.out.println(postDto.getUserId());
        // Find the user by ID from the postDto
        User user = userRepository.findById(postDto.getUserId())  // Fetch user based on the passed userId
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create the post
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getBody());
        post.setCommunity(community);
        post.setUser(user);
        post.setLinks(postDto.getLinks());
        post.setCreatedAt(Instant.now());

        // Process images and store URLs (you can store them locally or on cloud storage)
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String imageUrl = saveImage(image);  // Implement saveImage method
                post.setImageUrl(imageUrl);
                break; // If you want multiple images, handle this differently
            }
        }

        // Save the post
        postRepository.save(post);
    }

    // Mock implementation to save image and return URL
    private String saveImage(MultipartFile image) {
        String imageUrl = "/uploads/" + UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        return imageUrl;
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

}
