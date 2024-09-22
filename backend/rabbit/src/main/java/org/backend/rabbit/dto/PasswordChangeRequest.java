package org.backend.rabbit.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PasswordChangeRequest {

    // Getters and setters
    private String email; // Or use userId if you prefer
    private String currentPassword;
    private String newPassword;

}
