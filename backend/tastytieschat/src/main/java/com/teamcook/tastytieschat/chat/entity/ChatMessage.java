package com.teamcook.tastytieschat.chat.entity;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.constant.UserType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
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
    private String chatRoomId;
    private UserType userType;
    private String username;
    private String originLanguage;
    private String originMessage;
    private Map<String, String> translatedMessages;
    @CreatedDate
    private LocalDateTime createdTime;
    private boolean isTranslated;

    @Builder
    public ChatMessage(MessageType type, String chatRoomId, UserType userType, String username, String originLanguage, String originMessage) {
        this.type = type;
        this.chatRoomId = chatRoomId;
        this.userType = userType;
        this.username = username;
        this.originLanguage = originLanguage;
        this.originMessage = originMessage;
        this.translatedMessages = new HashMap<>();
        this.isTranslated = true;
    }

    public void addTranslatedMessage(String key, String value) {
        translatedMessages.put(key, value);
    }

    public boolean containTranslatedLanguage(String translatedLanguage) {
        return translatedMessages.containsKey(translatedLanguage);
    }

}
