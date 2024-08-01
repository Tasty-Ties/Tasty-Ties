package com.teamcook.tastyties.chat.dto;

import com.teamcook.tastyties.common.dto.RabbitMQUserDto;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ChatMessageDto {
    private String message;
    private RabbitMQUserDto user;
    private LocalDateTime createdTime;
}
