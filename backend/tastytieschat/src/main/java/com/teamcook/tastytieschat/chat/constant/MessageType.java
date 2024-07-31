package com.teamcook.tastytieschat.chat.constant;

public enum MessageType {
    SYSTEM("system"),
    USER("user");

    private final String type;

    MessageType(String type) {
        this.type = type;
    }
}
