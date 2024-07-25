package com.teamcook.tastyties.user.repository;

import com.teamcook.tastyties.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);

    boolean existsByUsername(String username);
    boolean existsByNickname(String nickname);
}
