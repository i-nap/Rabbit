package org.backend.rabbit.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;  // Community name is mandatory and unique

    @Column // Description is now optional (no nullable=false)
    private String description;  // Optional description

    @Column // Logo URL is now optional
    private String logoUrl;  // Optional field for storing the logo URL

    @Column // Cover image URL is now optional
    private String coverImageUrl;  // Optional field for storing the cover image URL

    @ElementCollection
    private List<String> tags;  // List of tags (assumed to be mandatory)

    @Column
    private String links;  // Optional links field

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

}
