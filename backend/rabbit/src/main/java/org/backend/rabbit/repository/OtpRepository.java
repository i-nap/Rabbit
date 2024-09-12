package org.backend.rabbit.repository;

import org.backend.rabbit.model.Otp;
import org.backend.rabbit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByUserAndOtpCode(User user, String otpCode);

    List<Otp> findByIsVerifiedFalseAndGeneratedAtBefore(Instant expirationTime);
}
