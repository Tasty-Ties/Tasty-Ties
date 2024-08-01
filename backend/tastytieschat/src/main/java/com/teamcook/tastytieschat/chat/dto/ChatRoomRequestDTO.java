package com.teamcook.tastytieschat.chat.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class ChatRoomRequestDTO {
    private String title;
    private UserDTO user;
}
