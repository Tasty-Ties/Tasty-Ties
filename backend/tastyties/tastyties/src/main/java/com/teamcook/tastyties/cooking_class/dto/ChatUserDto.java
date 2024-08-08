package com.teamcook.tastyties.cooking_class.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ChatUserDto {
    private String username;
    private String nickname;
    private String profileImageUrl;
    private String language;
}
