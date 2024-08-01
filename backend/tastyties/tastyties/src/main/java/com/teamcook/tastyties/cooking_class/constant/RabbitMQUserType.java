package com.teamcook.tastyties.cooking_class.constant;

public enum RabbitMQUserType {
    HOST("host"),
    ATTENDEE("attendee");

    private final String type;

    RabbitMQUserType(String type) {
        this.type = type;
    }
}
