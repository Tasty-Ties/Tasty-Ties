package com.teamcook.tastytieschat.notification.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FcmNotificationDto {
    private int userId;
    private String fcmToken;
    private String title;
    private String body;
    private LocalDateTime createTime;
}
