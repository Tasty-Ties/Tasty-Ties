package com.teamcook.tastyties.user.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class UserFcmTokenDto {
    private int userId;
    private String fcmToken;

    @QueryProjection
    public UserFcmTokenDto(int userId, String fcmToken) {
        this.userId = userId;
        this.fcmToken = fcmToken;
    }
}
