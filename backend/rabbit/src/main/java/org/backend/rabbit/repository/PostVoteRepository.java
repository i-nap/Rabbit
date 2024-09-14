package org.backend.rabbit.repository;

import org.backend.rabbit.model.Post;
import org.backend.rabbit.model.PostVote;
import org.backend.rabbit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostVoteRepository extends JpaRepository<PostVote, Long> {
    Optional<PostVote> findByPostAndUser(Post post, User user);
}
