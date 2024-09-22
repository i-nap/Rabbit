package org.backend.rabbit.controller;

import org.backend.rabbit.dto.PostCreationDTO;
import org.backend.rabbit.dto.PostDTO;
import org.backend.rabbit.model.Post;
import org.backend.rabbit.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/getposts")
    public List<PostDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{communityName}/posts")
    public ResponseEntity<List<PostDTO>> getPostsByCommunity(@PathVariable String communityName) {
        List<PostDTO> posts = postService.getPostsByCommunity(communityName);
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();  // Return 204 No Content if no posts are found
        }
        return ResponseEntity.ok(posts);  // Return PostDTO list
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long postId) {
        // Fetch the post from the service layer using postId
        PostDTO postDto = postService.findPostById(postId);
        if (postDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(postDto);
    }

//    @GetMapping("/createDummyPosts")
//    public String createDummyPosts() {
//        postService.createDummyPosts();
//        return "Dummy posts created successfully!";
//    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPost(
            @RequestPart("post") PostCreationDTO postDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        postService.createPost(postDto, images);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Post created successfully!");

        return ResponseEntity.ok(response);
    }

    // Fetch trending posts
    @GetMapping("/getTrendingPosts")
    public List<PostDTO> getTrendingPosts() {
        return postService.getTrendingPosts();
    }

    // Fetch most liked posts
    @GetMapping("/getMostLikedPosts")
    public List<PostDTO> getMostLikedPosts() {
        return postService.getMostLikedPosts();
    }

    // Fetch new posts
    @GetMapping("/getNewPosts")
    public List<PostDTO> getNewPosts() {
        return postService.getNewPosts();
    }
}
