package com.teamcook.tastytieschat.chat.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Document(collection = "chatuser")
@NoArgsConstructor
@Getter
@Setter
public class ChatUser {
    @Id
    private String id;
    private int userId;
    private Set<String> chatRoomIds;
}
