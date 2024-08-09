package com.teamcook.tastytieschat.notification.repository;


import com.teamcook.tastytieschat.notification.entity.FcmNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FcmNotificationRepository extends JpaRepository<FcmNotification, Integer> {
}
