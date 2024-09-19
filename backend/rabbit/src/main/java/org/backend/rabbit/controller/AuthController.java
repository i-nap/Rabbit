package org.backend.rabbit.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.backend.rabbit.dto.*;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.UserRepository;
import org.backend.rabbit.services.UserService;
import org.backend.rabbit.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDTO registrationData) {
        try {
            User user = userService.registerUser(
                    registrationData.getFName(),
                    registrationData.getLName(),
                    registrationData.getUsername(),
                    registrationData.getEmail(),
                    registrationData.getPassword(),
                    registrationData.getProfilePictureUrl(),
                    registrationData.isOAuth()
            );
            return ResponseEntity.ok("User registered. OTP sent to your email.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        try {
            String idToken = payload.get("id_token");
            String email = payload.get("email");
            String name = payload.get("name");
            String picture = payload.get("picture");

            // Check if the user exists in the database
            User user = userService.findByEmail(email);

            if (user == null) {
                // User doesn't exist, create one, but prompt for a username later
                user = new User();
                user.setEmail(email);
                user.setFirstName(name.split(" ")[0]);
                user.setLastName(name.split(" ")[1]);
                user.setProfilePictureUrl(picture);
                user.setEnabled(true); // Authenticated from Google
                user.setOAuth(true);   // Mark this as an OAuth user

                // Set a random username like "user1", "user2", etc.
                String newUsername = generateRandomUsername();
                user.setUsername(newUsername);

                // Save the new user
                userService.saveUser(user);
            } else if (user.getUsername() == null || user.getUsername().isEmpty()) {
                // If the user exists but doesn't have a username, generate one
                String newUsername = generateRandomUsername();
                user.setUsername(newUsername);
                userService.saveUser(user);
            }
// Generate JWT token
            String token = jwtUtil.generateToken(email);
            Instant tokenExpiration = jwtUtil.extractExpiration(token).toInstant();

            // Convert the User entity to a DTO
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setUsername(user.getUsername());
            userDTO.setEmail(user.getEmail());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setProfilePictureUrl(user.getProfilePictureUrl());

            // Create a response with token and user info
            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    userDTO.getId().toString(),
                    userDTO.getUsername(),
                    userDTO.getEmail(),
                    userDTO.getProfilePictureUrl(),
                    userDTO.getFirstName(),
                    userDTO.getLastName(),
                    user.getCreatedAt(),
                    tokenExpiration
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google authentication failed");
        }
    }
    private String generateRandomUsername() {
        // Find the user with the highest username that starts with "user"
        Optional<User> lastUserOptional = userRepository.findTopByUsernameStartingWithOrderByUsernameDesc("user");

        int userNumber = 1; // Default starting number

        // If a user is found, extract the number part from the username
        if (lastUserOptional.isPresent()) {
            User lastUser = lastUserOptional.get();
            String lastUsername = lastUser.getUsername();

            if (lastUsername != null && lastUsername.startsWith("user")) {
                String numberPart = lastUsername.substring(4); // Extract the numeric part after "user"
                try {
                    userNumber = Integer.parseInt(numberPart) + 1;
                } catch (NumberFormatException e) {
                    // In case of any issues, fallback to default number
                    userNumber = 1;
                }
            }
        }

        return "user" + userNumber; // Generate a new username like "user123"
    }


    @PostMapping("/oauth/set-username")
    public ResponseEntity<?> setUsername(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String username = payload.get("username");

        // Check if the username is already taken
        if (userService.usernameExists(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already taken");
        }

        // Fetch the user and update their username
        User user = userService.findByEmail(email);
        if (user != null) {
            user.setUsername(username);
            userService.saveUser(user);
            return ResponseEntity.ok("Username set successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }
    }



    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OTPVerificationDTO otpData) {
        boolean verified = userService.verifyOtp(otpData.getUsername(), otpData.getOtp());
        if (verified) {
            return ResponseEntity.ok("Account verified successfully.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {

        User user = userService.validateUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) {

            // Generate a JWT token using the user's email
            String token = jwtUtil.generateToken(user.getEmail());

            // Get the token expiration time as an Instant
            Instant tokenExpiration = jwtUtil.extractExpiration(token).toInstant();

            // Prepare user information
            String username = user.getUsername();
            String profilePicture = user.getProfilePictureUrl();  // Assuming user has a profile picture URL field
            String userId = user.getId().toString();

            // Return the token and user info in the response
            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    userId,
                    username,
                    user.getEmail(),
                    profilePicture,
                    user.getFirstName(),
                    user.getLastName(),
                    user.getCreatedAt(),
                    tokenExpiration  // Use Instant directly
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }


    // For logging out, no need to invalidate a session in stateless JWT
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully.");
    }
}
