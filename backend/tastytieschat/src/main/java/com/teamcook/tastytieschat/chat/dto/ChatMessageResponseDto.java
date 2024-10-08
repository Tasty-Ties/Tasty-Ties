package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
@Getter
public class ChatMessageResponseDto {

    private MessageType type;
    private String username;
    private String originLanguage;
    private Map<String, String> messages;
    private LocalDateTime createdTime;

    public ChatMessageResponseDto(ChatMessage chatMessage) {
        this.type = chatMessage.getType();
        this.username = chatMessage.getUsername();
        this.originLanguage = chatMessage.getOriginLanguage();
        this.messages = new HashMap<>();
        this.messages.put(chatMessage.getOriginLanguage(), chatMessage.getOriginMessage());
        this.messages.putAll(chatMessage.getTranslatedMessages());
        this.createdTime = chatMessage.getCreatedTime();
    }

}
