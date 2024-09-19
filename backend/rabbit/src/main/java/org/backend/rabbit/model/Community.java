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
    private String name;

    @Column
    private String description;

    @Column
    private String logoUrl;

    @Column
    private String coverImageUrl;

    @ElementCollection
    private List<String> tags;

    @Column
    private String links;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    // Many-to-One relationship for the user who creates the community
    @ManyToOne(fetch = FetchType.LAZY) // LAZY fetching to optimize performance
    @JoinColumn(name = "created_by", nullable = false) // Foreign key to User table
    private User createdBy;

    // Many-to-Many relationship for community subscribers
    @ManyToMany(mappedBy = "subscribedCommunities")

    private List<User> subscribers;
}
