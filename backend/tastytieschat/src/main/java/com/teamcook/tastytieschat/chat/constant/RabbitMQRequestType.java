package com.teamcook.tastytieschat.chat.constant;

public enum RabbitMQRequestType {
    CREATE("create"),
    DELETE("delete"),
    JOIN("join"),
    LEAVE("leave");

    private final String type;

    RabbitMQRequestType(String type) {
        this.type = type;
    }
}
