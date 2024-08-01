package com.teamcook.tastyties.chat.dto;

import lombok.Getter;

@Getter
public class ChatRoomDto {
    private String id;
    private String imageUrl;
    private String title;
    private ChatMessageDto message;
}
