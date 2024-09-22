package org.backend.rabbit.services;

import jakarta.transaction.Transactional;
import org.backend.rabbit.model.Otp;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.CommentRepository;
import org.backend.rabbit.repository.OtpRepository;
import org.backend.rabbit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
public class UserCleanupService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;
    @Autowired
    private CommentRepository commentRepository;

    // Run every hour to clean up unverified users
    @Scheduled(initialDelay = 0, fixedRate = 3600000) // Run immediately and then every hour
    @Transactional // Ensure this method runs in a transaction
    public void cleanUpUnverifiedUsers() {
        Instant expirationTime = Instant.now().minusSeconds(300);  // OTP expires after 5 minutes

        // Find all OTPs that are not verified and are older than the expiration time
        List<Otp> expiredOtps = otpRepository.findByUser_EnabledFalseAndGeneratedAtBefore(expirationTime);

        for (Otp otp : expiredOtps) {
            User user = otp.getUser();

            // Step 2: Delete the unverified user
            userRepository.delete(user);

            // Step 3: Delete the associated OTP
            otpRepository.delete(otp);
        }
    }
}
