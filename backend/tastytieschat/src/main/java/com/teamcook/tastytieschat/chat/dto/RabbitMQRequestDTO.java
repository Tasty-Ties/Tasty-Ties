package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.RabbitMQRequestType;
import lombok.Getter;

@Getter
public class RabbitMQRequestDTO {
    private RabbitMQRequestType type;
    private String chatRoomId;
    private String title;
    private UserDTO user;
}
