package com.teamcook.tastyties.user.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@ToString
public class AuthRequestDto {
    private String username;
    private String password;
    private String fcmToken;
}
