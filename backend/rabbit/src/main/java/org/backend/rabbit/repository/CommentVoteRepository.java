package org.backend.rabbit.repository;

import org.backend.rabbit.model.CommentVote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentVoteRepository extends JpaRepository<CommentVote, Long> {
}
