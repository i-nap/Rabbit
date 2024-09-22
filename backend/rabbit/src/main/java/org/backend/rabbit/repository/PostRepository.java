package org.backend.rabbit.repository;

import org.backend.rabbit.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCommunity_Name(String communityName);
    // Find trending posts (e.g., based on number of votes and recent activity)
    @Query("SELECT p FROM Post p ORDER BY p.votes DESC, p.createdAt DESC")
    List<Post> findTrendingPosts();

    // Find most liked posts (e.g., based purely on number of votes)
    @Query("SELECT p FROM Post p ORDER BY p.votes DESC")
    List<Post> findMostLikedPosts();

    // Find new posts (e.g., based on creation time)
    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    List<Post> findNewPosts();
}
