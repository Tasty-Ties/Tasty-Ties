package com.teamcook.tastytieschat.chat.entity;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.dto.ChatRequestDTO;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "chatmessage")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatMessage {

    @Id
    private String id;
    private MessageType type;
    private int chatRoomId;
    private int userId;
    private String userNickname;
    private String originLanguage;
    private String originMessage;
    private Map<String, String> translatedMessages;
    @CreatedDate
    private Instant createdTime;

    @Builder
    public ChatMessage(int chatRoomId, String userNickname, String originLanguage, ChatRequestDTO chatRequestDTO) {
        this.type = MessageType.USER;
        this.chatRoomId = chatRoomId;
        this.userId = chatRequestDTO.getUserId();
        this.userNickname = userNickname;
        this.originLanguage = originLanguage;
        this.originMessage = chatRequestDTO.getMessage();
        this.translatedMessages = new HashMap<>();
    }

    public void addTranslatedMessage(String key, String value) {
        translatedMessages.put(key, value);
    }

    public boolean containTranslatedLanguage(String translatedLanguage) {
        return translatedMessages.containsKey(translatedLanguage);
    }

}
