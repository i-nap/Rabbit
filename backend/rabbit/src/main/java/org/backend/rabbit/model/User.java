package org.backend.rabbit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
@Entity
@Table(name="users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=true, unique = true)
    private String username;

    @Column
    private String password;

    @Column(nullable=false)
    private String firstName;

    @Column(nullable=false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private boolean enabled;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    // One-to-Many relationship for OTPs
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Otp> otps;

    // New Many-to-Many relationship for community subscriptions
    @ManyToMany
    @JoinTable(
            name = "user_community",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "community_id")
    )
    @JsonIgnore  // Prevents recursive serialization
    private List<Community> subscribedCommunities;

    @Column(nullable = true) // Nullable is true to make it optional
    private String profilePictureUrl;

    @Column(nullable = false)
    private boolean isOAuth; // New column to distinguish OAuth users
}

