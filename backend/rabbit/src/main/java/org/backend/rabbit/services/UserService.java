package org.backend.rabbit.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.backend.rabbit.dto.ProfileUpdateDTO;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

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

    private final String uploadDirectory = "C:/uploads/profile-pictures/";  // Choose a permanent directory


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

    public User updateUserProfile(Long userId, ProfileUpdateDTO profileUpdateDTO) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Update user fields (only if not null)
        if (profileUpdateDTO.getFirstName() != null && !profileUpdateDTO.getFirstName().isEmpty()) {
            user.setFirstName(profileUpdateDTO.getFirstName());
        }
        if (profileUpdateDTO.getLastName() != null && !profileUpdateDTO.getLastName().isEmpty()) {
            user.setLastName(profileUpdateDTO.getLastName());
        }
        if (profileUpdateDTO.getUsername() != null && !profileUpdateDTO.getUsername().isEmpty()) {
            user.setUsername(profileUpdateDTO.getUsername());
        }
        if (profileUpdateDTO.getPassword() != null && !profileUpdateDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(profileUpdateDTO.getPassword())); // Make sure to encode password
        }

        // Save profile picture (if uploaded)
        if (profileUpdateDTO.getProfilePicture() != null && !profileUpdateDTO.getProfilePicture().isEmpty()) {
            String pictureUrl = saveProfilePicture(profileUpdateDTO.getProfilePicture()); // Method that saves the picture
            user.setProfilePictureUrl(pictureUrl);
        }

        // Save the updated user
        return userRepository.save(user);
    }


    private String saveProfilePicture(MultipartFile file) throws IOException {
        // Generate a unique file name using UUID
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + "." + fileExtension;

        // Create the directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath); // Create the directory
        }

        // Save the file locally
        Path filePath = uploadPath.resolve(fileName);
        file.transferTo(filePath.toFile());

        // Return the relative URL for saving in the database
        return "http://localhost:8080"+"/uploads/profile-pictures/" + fileName;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "jpg"; // Default extension if none is found
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
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
