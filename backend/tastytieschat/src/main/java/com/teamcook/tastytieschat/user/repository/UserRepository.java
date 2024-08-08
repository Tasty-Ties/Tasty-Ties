package com.teamcook.tastytieschat.user.repository;

import com.teamcook.tastytieschat.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.username IN :usernames")
    Set<User> findByUsernames(@Param("usernames") Set<String> usernames);
    Optional<User> findByUsername(String username);
}
