package com.teamcook.tastytieschat.chat.constant;

import com.teamcook.tastytieschat.chat.entity.ChatMessage;

import java.util.HashMap;
import java.util.Map;

public enum SystemMessage {
    ENTER(new HashMap<>(){{
        put(Language.KO, "님이 들어왔습니다.");
        put(Language.EN, " has joined the chat room.");
    }}),
    EXIT(new HashMap<>(){{
        put(Language.KO, "님이 나갔습니다.");
        put(Language.EN, " left the chat room.");
    }}),
    AUTHORIZATION_ERROR(new HashMap<>(){{
        put(Language.KO, "해당 채팅방에 대한 권한이 없습니다.");
        put(Language.EN, "You do not have permission for this chat room.");
    }});

    private final Map<Language, String> messages;

    SystemMessage(Map<Language, String> messages) {
        this.messages = messages;
    }

    public ChatMessage getSystemChatMessage(String chatRoomId, String userNickname) {
        ChatMessage chatMessage = ChatMessage.builder()
                .type(MessageType.SYSTEM)
                .chatRoomId(chatRoomId)
                .build();

        for (Language language : messages.keySet()) {
            if (language.equals("Korean")) {
                chatMessage.setOriginLanguage("Korean");
                chatMessage.setOriginMessage(userNickname + messages.get(language));
            } else {
                chatMessage.addTranslatedMessage(language.getName(), userNickname + messages.get(language));
            }
        }

        return chatMessage;
    }
}
