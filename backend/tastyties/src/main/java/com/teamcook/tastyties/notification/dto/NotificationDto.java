package com.teamcook.tastyties.notification.dto;

import com.teamcook.tastyties.notification.entity.FcmNotification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class NotificationDto {
    private int id;
    private String title;
    private String body;
    private LocalDateTime createTime;
    private boolean isRead;

    public NotificationDto(FcmNotification notification) {
        this.id = notification.getId();
        this.title = notification.getTitle();
        this.body = notification.getBody();
        this.createTime = notification.getCreateTime();
        this.isRead = notification.isRead();
    }
}
