package com.teamcook.tastytieschat.chat.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "chatuser")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ChatUser {
    @Id
    private String id;
    private String username;
    private Set<String> chatRoomIds;

    public ChatUser(String username, String chatRoomId) {
        this.username = username;
        this.chatRoomIds = new HashSet<>();
        chatRoomIds.add(chatRoomId);
    }

    public void addChatRoomId(String chatRoomId) {
        chatRoomIds.add(chatRoomId);
    }

    public void removeChatRoomId(String chatRoomId) {
        chatRoomIds.remove(chatRoomId);
    }
}
