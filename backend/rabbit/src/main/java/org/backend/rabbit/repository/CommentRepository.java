package org.backend.rabbit.repository;

import org.backend.rabbit.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId); // Custom query to find comments by postId
}
