package com.teamcook.tastytieschat.chat.constant;

import com.teamcook.tastytieschat.chat.entity.ChatMessage;

import java.util.HashMap;
import java.util.Map;

public enum SystemMessage {
    ENTER(new HashMap<>(){{
        put("Korean", "님이 들어왔습니다.");
        put("English", " came into the chat room.");
    }}),
    EXIT(new HashMap<>(){{
        put("Korean", "님이 나갔습니다.");
        put("English", " left the chat room.");
    }});

    private final Map<String, String> messages;

    SystemMessage(Map<String, String> messages) {
        this.messages = messages;
    }

    public void setSystemChatMessage(String userNickname, ChatMessage chatMessage) {
        for (String language : messages.keySet()) {
            if (language.equals("Korean")) {
                chatMessage.setOriginLanguage("Korean");
                chatMessage.setOriginMessage(userNickname + messages.get(language));
            } else {
                chatMessage.addTranslatedMessage(language, userNickname + messages.get(language));
            }
        }
    }
}
