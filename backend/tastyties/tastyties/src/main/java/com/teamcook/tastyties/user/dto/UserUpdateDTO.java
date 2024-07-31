package com.teamcook.tastyties.user.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String nickname;
    private String email;
    private String password;
    private String description;
    private String snsUrl;
}
