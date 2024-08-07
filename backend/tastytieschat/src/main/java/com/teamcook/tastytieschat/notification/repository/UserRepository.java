package com.teamcook.tastytieschat.notification.repository;

import com.teamcook.tastytieschat.notification.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.userId IN :ids")
    Set<User> findByUserIds(@Param("ids") Set<Integer> ids);
}
