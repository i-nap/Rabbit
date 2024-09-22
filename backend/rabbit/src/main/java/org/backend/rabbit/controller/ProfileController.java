package org.backend.rabbit.controller;

import org.backend.rabbit.dto.ProfileUpdateDTO;
import org.backend.rabbit.model.User;
import org.backend.rabbit.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, String>> updateProfile(
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "password", required = false) String password, // Optional password
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) throws IOException {

        System.out.println(profilePicture);
        // Create DTO with password, first name, last name, username, and profile picture
        ProfileUpdateDTO profileUpdateDTO = new ProfileUpdateDTO(firstName, lastName, username, profilePicture, password);

        // Call the service to update the profile and get the updated user data
        User updatedUser = userService.updateUserProfile(userId, profileUpdateDTO);

        // Return success message with profile picture URL
        String profilePictureUrl = updatedUser.getProfilePictureUrl();
        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "profilePictureUrl", profilePictureUrl != null ? profilePictureUrl : ""
        ));
    }



}
