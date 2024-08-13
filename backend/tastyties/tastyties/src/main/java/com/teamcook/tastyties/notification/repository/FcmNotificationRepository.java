package com.teamcook.tastyties.notification.repository;

import com.teamcook.tastyties.notification.entity.FcmNotification;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FcmNotificationRepository extends JpaRepository<FcmNotification, Integer> {

    @Query("SELECT f FROM FcmNotification f WHERE f.user = :user AND f.createTime >= :startTime ORDER BY f.createTime DESC")
    Page<FcmNotification> findRecentNotifications(@Param("user") User user, @Param("startTime") LocalDateTime startTime, Pageable pageable);
    @Modifying(clearAutomatically = true)
    @Query("UPDATE FcmNotification f SET f.isRead = CASE WHEN f.isRead = true THEN false ELSE true END WHERE f.user = :user AND f.id = :notificationId")
    void changeIsReadNotification(@Param("user") User user, @Param("notificationId") int notificationId);
    @Modifying
    @Query("DELETE FcmNotification f WHERE f.user = :user AND f.id IN :notificationIds")
    void deleteNotification(@Param("user") User user, @Param("notificationIds") List<Integer> notificationIds);

}
