package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.constant.UserType;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Builder
@Getter
public class ChatMessageDto {
    private MessageType type;
    private UserType userType;
    private String username;
    private Map<String, String> messages;
    private LocalDateTime createdTime;

    public ChatMessageDto(ChatMessage chatMessage) {
        this.type = chatMessage.getType();
        this.userType = chatMessage.getUserType();
        this.username = chatMessage.getUsername();
        this.messages = new HashMap<>();
        this.messages.put(chatMessage.getOriginLanguage(), chatMessage.getOriginMessage());
        this.messages.putAll(chatMessage.getTranslatedMessages());
        this.createdTime = chatMessage.getCreatedTime();
    }

}
