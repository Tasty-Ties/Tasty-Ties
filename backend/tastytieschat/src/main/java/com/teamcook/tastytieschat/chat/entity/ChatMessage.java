package com.teamcook.tastytieschat.chat.entity;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
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
    private String originMessage;
    private Map<String, String> translatedMessages;
    private LocalDate createdTime;

}
