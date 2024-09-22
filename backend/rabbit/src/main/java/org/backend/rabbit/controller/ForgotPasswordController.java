package org.backend.rabbit.controller;// package org.backend.rabbit.controller;

import org.backend.rabbit.dto.PasswordResetRequest;
import org.backend.rabbit.services.AuthService;
import org.backend.rabbit.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    @Autowired
    private AuthService authService;

    // Endpoint to send OTP for password reset
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody User user) {
        boolean otpSent = authService.sendPasswordResetOtp(user.getEmail());
        if (otpSent) {
            return ResponseEntity.ok("OTP sent to your email.");
        } else {
            return ResponseEntity.badRequest().body("Email not found.");
        }
    }

    // Endpoint to reset password using OTP
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        boolean isReset = authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        if (isReset) {
            return ResponseEntity.ok("Password reset successful.");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP or expired.");
        }
    }
}
