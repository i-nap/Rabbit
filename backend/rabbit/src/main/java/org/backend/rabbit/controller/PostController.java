package org.backend.rabbit.controller;

import org.backend.rabbit.dto.PostCreationDTO;
import org.backend.rabbit.dto.PostDTO;
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

    @GetMapping("/createDummyPosts")
    public String createDummyPosts() {
        postService.createDummyPosts();
        return "Dummy posts created successfully!";
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPost(
            @RequestPart("post") PostCreationDTO postDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        postService.createPost(postDto, images); // Implement this in the service layer

        // Create a response map to include a message
        Map<String, String> response = new HashMap<>();
        response.put("message", "Post created successfully!");

        return ResponseEntity.ok(response);
    }
}
