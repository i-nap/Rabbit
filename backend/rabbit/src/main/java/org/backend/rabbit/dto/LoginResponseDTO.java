package org.backend.rabbit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {

    private String token;
    private String username;
    private String email;
    private String profilePicture;
    private String firstName;
    private String lastName;
    private Instant onCreate;
    private Instant tokenExpiration;  // Field for token expiration time

}
