package com.teamcook.tastytieschat.chat.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class ChatRoomRequestDto {
    private String title;
    private UserDto user;
}
