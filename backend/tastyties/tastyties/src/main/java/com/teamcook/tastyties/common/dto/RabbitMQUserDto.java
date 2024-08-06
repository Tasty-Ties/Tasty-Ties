package com.teamcook.tastyties.common.dto;

import com.teamcook.tastyties.common.constant.RabbitMQUserType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RabbitMQUserDto {
    private int id;
    private RabbitMQUserType type;
    private String nickname;
    private String language;
    private String imageUrl;
    private LocalDateTime enteredTime;

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof RabbitMQUserDto) {
            return this.id == ((RabbitMQUserDto) obj).id;
        }

        return false;
    }

}
