package org.backend.rabbit.repository;

import org.backend.rabbit.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    Optional<Community> findByName(String name);

    List<Community> findByCreatedById(Long userId);
}
