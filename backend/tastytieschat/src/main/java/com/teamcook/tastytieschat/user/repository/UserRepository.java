package com.teamcook.tastytieschat.user.repository;

import com.teamcook.tastytieschat.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.username IN :usernames")
    List<User> findByUsernames(@Param("usernames") List<String> usernames);
    @Query("SELECT u FROM User u WHERE u.username IN :usernames AND u.fcmToken IS NOT NULL")
    List<User> findFcmTokensByUsernames(@Param("usernames") List<String> usernames);
    Optional<User> findByUsername(String username);
}
