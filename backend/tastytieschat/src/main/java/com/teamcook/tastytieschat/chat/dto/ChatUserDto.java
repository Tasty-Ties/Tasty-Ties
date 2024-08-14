package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;

@AllArgsConstructor
@Builder
public class ChatUserDto {
    private int id;
    private UserType type;
    private String nickname;
    private String profileImageUrl;
}
