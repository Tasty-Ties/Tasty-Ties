package com.teamcook.tastyties.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FcmNotificationDto {
    private int userId;
    private String fcmToken;
    private String title;
    private String body;
    private LocalDateTime createTime;
}
