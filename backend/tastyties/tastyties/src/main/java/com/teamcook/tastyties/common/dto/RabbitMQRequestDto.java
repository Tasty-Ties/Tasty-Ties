package com.teamcook.tastyties.common.dto;

import com.teamcook.tastyties.common.constant.RabbitMQRequestType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RabbitMQRequestDto {
    private RabbitMQRequestType type;
    private String chatRoomId;
    private String title;
    private String imageUrl;
    private RabbitMQUserDto user;
}
