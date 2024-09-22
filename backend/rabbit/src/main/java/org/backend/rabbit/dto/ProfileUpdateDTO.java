package org.backend.rabbit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileUpdateDTO {
    private String firstName;
    private String lastName;
    private String username;
    private MultipartFile profilePicture;
    private String password;
}
