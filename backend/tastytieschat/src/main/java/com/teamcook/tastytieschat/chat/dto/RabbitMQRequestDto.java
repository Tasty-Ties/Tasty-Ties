package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.RabbitMQRequestType;
import lombok.Getter;

@Getter
public class RabbitMQRequestDto {
    private RabbitMQRequestType type;
    private String chatRoomId;
    private String title;
    private String imageUrl;
    private UserDto user;

    public int getUserId() {
        return user.getId();
    }
}
