package com.teamcook.tastyties.notification.repository;

import com.teamcook.tastyties.notification.entity.FcmNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FcmNotificationRepository extends JpaRepository<FcmNotification, Integer> {
}
