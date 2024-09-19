package org.backend.rabbit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRegistrationDTO {
    private String fName;
    private String lName;
    private String username;
    private String email;
    private String password;
    private String profilePictureUrl;
    private boolean isOAuth;
}
