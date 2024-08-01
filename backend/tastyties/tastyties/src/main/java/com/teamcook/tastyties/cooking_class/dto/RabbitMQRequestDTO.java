package com.teamcook.tastyties.cooking_class.dto;

import com.teamcook.tastyties.cooking_class.constant.RabbitMQRequestType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RabbitMQRequestDTO {
    private RabbitMQRequestType type;
    private String chatRoomId;
    private String title;
    private RabbitMQUserDTO user;
}
