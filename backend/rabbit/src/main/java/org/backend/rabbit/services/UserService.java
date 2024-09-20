package org.backend.rabbit.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.backend.rabbit.model.Otp;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.CommunityRepository;
import org.backend.rabbit.repository.OtpRepository;
import org.backend.rabbit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private static final int OTP_LENGTH = 6;

    public User registerUser(String fName, String lName, String username, String email, String password, String profilePictureUrl, boolean oAuth) {
        // Check if email or username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already registered.");
        }

        // Hash the password and create a new user (initially disabled)
        String encodedPassword = passwordEncoder.encode(password);
        User newUser = User.builder()
                .firstName(fName)
                .lastName(lName)
                .username(username)
                .email(email)
                .password(encodedPassword)
                .profilePictureUrl(profilePictureUrl)
                .isOAuth(false)// Set profile picture URL
                .enabled(false)  // User is disabled until OTP verification
                .build();

        userRepository.save(newUser);

        // Send OTP to user's email
        sendOtp(newUser);

        return newUser;
    }

    private void editProfile(User user){

    }

    public Optional<User> findLastUsernameWithPrefix(String prefix) {
        // This method should query the database and return the last username that starts with 'user'
        // For example:
        return userRepository.findTopByUsernameStartingWithOrderByUsernameDesc(prefix);
    }

    // Check if the username already exists
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional // Ensure the transaction is handled properly
    public void saveUser(User user) {
        System.out.println("Saving user: " + user);
        userRepository.save(user);
    }

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
            helper.setText(buildHtmlOtpMessage(user, otp), true); // Use true to indicate it's HTML content

            mailSender.send(message);
            System.out.println("Sending OTP to: " + user.getEmail());

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }


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

    public String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));  // Generate random digits
        }
        return otp.toString();
    }

    public boolean verifyOtp(String username, String otpCode) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            Optional<Otp> otpEntity = otpRepository.findByUserAndOtpCode(user.get(), otpCode);
            if (otpEntity.isPresent() && !otpEntity.get().isVerified()) {
                Otp otp = otpEntity.get();
                // Check if the OTP has expired (5-minute expiry in this example)
                if (otp.getGeneratedAt().isAfter(Instant.now().minusSeconds(300))) {  // 5 minutes = 300 seconds
                    otp.setVerified(true);
                    otpRepository.save(otp);

                    // Activate the user
                    User verifiedUser = user.get();
                    verifiedUser.setEnabled(true);
                    userRepository.save(verifiedUser);

                    return true;
                } else {
                    // OTP has expired, delete the user
                    userRepository.delete(user.get());
                    otpRepository.delete(otp);
                }
            }
        }
        return false;
    }



    public User validateUser(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        // Check if user exists and the raw password matches the stored encrypted password
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return user;  // Password matches, return the user
            }
        }
        return null;  // User not found or password doesn't match
    }

    public User findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);  // Return null if user not found, or handle the case as per your requirements
    }
}
