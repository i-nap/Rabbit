package org.backend.rabbit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostCreationDTO {
    private String community;
    private String title;
    private String body;
    private String links;

}
