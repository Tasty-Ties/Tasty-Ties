package com.teamcook.tastytieschat.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class ChatRoomDto {
    private String id;
    private String imageUrl;
    private String title;
    private ChatMessageDto message;
}
