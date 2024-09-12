package org.backend.rabbit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OTPVerificationDTO {
    private String username;
    private String otp;
}
