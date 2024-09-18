package org.backend.rabbit.controller;

import org.backend.rabbit.dto.LoginRequestDTO;
import org.backend.rabbit.dto.LoginResponseDTO;
import org.backend.rabbit.dto.OTPVerificationDTO;
import org.backend.rabbit.dto.UserRegistrationDTO;
import org.backend.rabbit.model.User;
import org.backend.rabbit.services.UserService;
import org.backend.rabbit.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDTO registrationData) {
        try {
            User user = userService.registerUser(
                    registrationData.getFName(),
                    registrationData.getLName(),
                    registrationData.getUsername(),
                    registrationData.getEmail(),
                    registrationData.getPassword(),
                    registrationData.getProfilePictureUrl()

            );
            return ResponseEntity.ok("User registered. OTP sent to your email.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
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
