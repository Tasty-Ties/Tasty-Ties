package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
@Getter
public class ChatResponseDTO {

    private MessageType type;
    private int userId;
    private String userNickname;
    private Map<String, String> messages;
    private Instant createdTime;

    public ChatResponseDTO(ChatMessage chatMessage) {
        this.type = chatMessage.getType();
        this.userId = chatMessage.getUserId();
        this.userNickname = chatMessage.getUserNickname();
        this.messages = new HashMap<>();
        this.messages.put(chatMessage.getOriginLanguage(), chatMessage.getOriginMessage());
        // TODO: 원본 메시지 번역 후 저장
//        this.messages.putAll(chatMessage.getTranslatedMessages());
        this.createdTime = chatMessage.getCreatedTime();
    }

}
