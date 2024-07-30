package com.teamcook.tastytieschat.chat.constant;

import com.teamcook.tastytieschat.chat.entity.ChatMessage;

import java.util.HashMap;
import java.util.Map;

public enum SystemMessage {
    ENTER(new HashMap<>(){{
        put(Language.KO, "님이 들어왔습니다.");
        put(Language.EN, " came into the chat room.");
    }}),
    EXIT(new HashMap<>(){{
        put(Language.KO, "님이 나갔습니다.");
        put(Language.EN, " left the chat room.");
    }});

    private final Map<Language, String> messages;

    SystemMessage(Map<Language, String> messages) {
        this.messages = messages;
    }

    public void setSystemChatMessage(String userNickname, ChatMessage chatMessage) {
        for (Language language : messages.keySet()) {
            if (language.equals("Korean")) {
                chatMessage.setOriginLanguage("Korean");
                chatMessage.setOriginMessage(userNickname + messages.get(language));
            } else {
                chatMessage.addTranslatedMessage(language.getName(), userNickname + messages.get(language));
            }
        }
    }
}
