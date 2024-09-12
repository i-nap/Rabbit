package org.backend.rabbit.controller;

import org.backend.rabbit.dto.LoginRequestDTO;
import org.backend.rabbit.dto.OTPVerificationDTO;
import org.backend.rabbit.dto.UserRegistrationDTO;
import org.backend.rabbit.model.User;
import org.backend.rabbit.services.UserService;
import org.backend.rabbit.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            // Register the user (this will throw an exception if username/email exists)
            User user = userService.registerUser(
                    registrationData.getFName(),
                    registrationData.getLName(),
                    registrationData.getUsername(),
                    registrationData.getEmail(),
                    registrationData.getPassword()
            );
            return ResponseEntity.ok("User registered. OTP sent to your email.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    // OTP verification endpoint
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
            return ResponseEntity.ok(token);  // Return the token as a response
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
