package org.backend.rabbit.services;

import org.backend.rabbit.model.Otp;
import org.backend.rabbit.model.User;
import org.backend.rabbit.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {
    @Autowired
    private OtpRepository otpRepository;

    private static final int OTP_EXPIRATION_MINUTES = 10; // OTP valid for 10 minutes

    public Otp generateOtp(User user) {
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        Instant generatedAt = Instant.now();

        Otp otp = Otp.builder()
                .otpCode(otpCode)
                .generatedAt(generatedAt)
                .isVerified(false)
                .user(user)
                .build();

        otpRepository.save(otp);
        return otp;
    }

    public boolean verifyOtp(User user, String otpCode) {
        Optional<Otp> otpOpt = otpRepository.findByUser(user);
        if (otpOpt.isPresent()) {
            Otp otp = otpOpt.get();
            if (otp.getOtpCode().equals(otpCode) && Instant.now().isBefore(otp.getGeneratedAt().plusSeconds(OTP_EXPIRATION_MINUTES * 60))) {
                otp.setVerified(true);
                otpRepository.save(otp); // Mark the OTP as verified
                return true;
            }
        }
        return false;
    }

    public void deleteOtp(User user) {
        otpRepository.deleteByUser(user);
    }
}
