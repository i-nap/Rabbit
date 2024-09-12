package org.backend.rabbit.controller;

import org.backend.rabbit.dto.OTPVerificationDTO;
import org.backend.rabbit.dto.UserRegistrationDTO;
import org.backend.rabbit.model.User;
import org.backend.rabbit.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegistrationDTO registrationData) {
        System.out.println("Email received: " + registrationData.getEmail());  // Check what is being received as email
        System.out.println("Registration request received: " + registrationData.getUsername());

        User user = userService.registerUser(
                registrationData.getFName(),
                registrationData.getLName(),
                registrationData.getUsername(),
                registrationData.getEmail(),
                registrationData.getPassword()
        );

        return ResponseEntity.ok("User registered. OTP sent to your email.");
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
}
