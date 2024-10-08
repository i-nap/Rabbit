package org.backend.rabbit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.backend.rabbit.model.User;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username); // Check if a username exists
    Optional<User> findTopByUsernameStartingWithOrderByUsernameDesc(String prefix);

}
