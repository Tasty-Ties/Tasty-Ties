package com.teamcook.tastyties.common.constant;

public enum RabbitMQRequestType {
    CREATE("create"),
    DELETE("delete"),
    JOIN("join"),
    LEAVE("leave");

    private final String type;

    RabbitMQRequestType(String type) {
        this.type = type;
    }

    public String getType() {
        return this.type;
    }
}
