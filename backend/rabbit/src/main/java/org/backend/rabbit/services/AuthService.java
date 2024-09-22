package org.backend.rabbit.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.backend.rabbit.model.Otp;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.OtpRepository;
import org.backend.rabbit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import java.time.Instant;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Send OTP via email for verification
    public boolean sendPasswordResetOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            sendOtp(user); // Generate and send OTP
            return true;
        }
        return false;
    }

    // Reset the password using OTP
    public boolean resetPassword(String email, String otpCode, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Optional<Otp> otpOpt = otpRepository.findByUserAndOtpCode(user, otpCode);
            if (otpOpt.isPresent()) {
                Otp otp = otpOpt.get();
                if (otp.getGeneratedAt().plusSeconds(300).isAfter(Instant.now())) {
                    String encodedPassword = passwordEncoder.encode(newPassword);
// OTP valid for 5 mins
                    user.setPassword(encodedPassword); // Encode password as necessary
                    userRepository.save(user);
                    otpRepository.delete(otp); // Remove OTP after usage
                    return true;
                }
            }
        }
        return false;
    }

    // Helper method to send OTP via email
    private void sendOtp(User user) {
        String otp = generateOtp();
        Otp otpEntity = Otp.builder()
                .otpCode(otp)
                .user(user)
                .generatedAt(Instant.now())
                .isVerified(false)
                .build();
        otpRepository.save(otpEntity);

        // Send OTP to email
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());
            helper.setSubject("Account Verification OTP");
            helper.setText(buildHtmlOtpMessage(user, otp), true); // Send HTML content

            mailSender.send(message);
            System.out.println("Sending OTP to: " + user.getEmail());

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    // Helper method to build HTML OTP message
    private String buildHtmlOtpMessage(User user, String otp) {
        return "<html>" +
                "<body>" +
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='text-align: center; background-color: black; padding: 10px;'>" +
                "<h1 style='color: white;'>Verify Your Account</h1>" +
                "</div>" +
                "<div style='background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>" +
                "<p>Dear " + user.getFirstName() + " " + user.getLastName() + ",</p>" +
                "<p>Thank you for registering! To complete your signup, please verify your account using the OTP below:</p>" +
                "<div style='text-align: center;'>" +
                "<span style='display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50;'>" + otp + "</span>" +
                "</div>" +
                "<p>This OTP is valid for the next <strong>5 minutes</strong>.</p>" +
                "<p>If you did not request this, please ignore this email.</p>" +
                "</div>" +
                "<div style='text-align: center; margin-top: 20px; font-size: 12px; color: #888;'>" +
                "<p>&copy; 2024 Your Company Name</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    // Helper method to generate random OTP
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }

    public boolean changePassword(String email, String currentPassword, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOptional.get();

// Verify the current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false; // Current password is incorrect
        }

// Update the password with the new one
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return true;
    }
}
