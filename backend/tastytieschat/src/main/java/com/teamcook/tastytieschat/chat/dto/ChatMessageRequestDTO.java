package com.teamcook.tastytieschat.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatMessageRequestDTO {

    private int userId;
    private String message;

}
