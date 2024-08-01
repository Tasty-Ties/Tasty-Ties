package com.teamcook.tastytieschat.chat.constant;

public enum UserType {
    HOST("host"),
    ATTENDEE("attendee");

    private final String type;

    UserType(String type) {
        this.type = type;
    }
}
