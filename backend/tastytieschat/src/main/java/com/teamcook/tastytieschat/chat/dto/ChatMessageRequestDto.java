package com.teamcook.tastytieschat.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ChatMessageRequestDto {

    private String username;
    private String message;

}
