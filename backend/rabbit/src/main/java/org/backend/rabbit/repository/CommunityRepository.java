package org.backend.rabbit.repository;

import org.backend.rabbit.model.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    Optional<Community> findByName(String name);

    List<Community> findByCreatedById(Long userId);

    @Query("SELECT c FROM Community c JOIN c.subscribers u WHERE u.id = :userId")
    List<Community> findSubscribedCommunitiesByUserId(@Param("userId") Long userId);
    // Custom search query to search by name, description, or tags
    @Query("SELECT c FROM Community c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR EXISTS (SELECT t FROM Community community JOIN community.tags t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Community> searchCommunitiesByKeyword(String keyword);

    List<Community> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrTagsContaining(String name, String description, String tags);
    @Query("SELECT c FROM Community c ORDER BY RANDOM()")
    Page<Community> findRandomCommunities(Pageable pageable);
}
