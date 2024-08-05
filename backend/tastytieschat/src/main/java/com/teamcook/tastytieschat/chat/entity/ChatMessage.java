package com.teamcook.tastytieschat.chat.entity;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.dto.ChatMessageRequestDto;
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
    private int userId;
    private String userNickname;
    private String originLanguage;
    private String originMessage;
    private Map<String, String> translatedMessages;
    @CreatedDate
    private LocalDateTime createdTime;

    @Builder
    public ChatMessage(MessageType type, String chatRoomId, String userNickname, String originLanguage, String originMessage, ChatMessageRequestDto chatMessageRequestDto) {
        this.type = type;
        this.chatRoomId = chatRoomId;
        if (chatMessageRequestDto != null) {
            this.userId = chatMessageRequestDto.getUserId();
        }
        this.userNickname = userNickname;
        this.originLanguage = originLanguage;
        if (chatMessageRequestDto != null) {
            this.originMessage = chatMessageRequestDto.getMessage();
        } else {
            this.originMessage = originMessage;
        }
        this.translatedMessages = new HashMap<>();
    }

    public void addTranslatedMessage(String key, String value) {
        translatedMessages.put(key, value);
    }

    public boolean containTranslatedLanguage(String translatedLanguage) {
        return translatedMessages.containsKey(translatedLanguage);
    }

}
