package com.teamcook.tastyties.user.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String nickname;
    private String emailId;
    private String emailDomain;
    private String password;
    private String description;
    private String instagramUrl;
    private String youtubeUrl;
}
