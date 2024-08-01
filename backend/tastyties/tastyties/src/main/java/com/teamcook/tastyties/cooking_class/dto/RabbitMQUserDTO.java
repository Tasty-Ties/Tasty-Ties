package com.teamcook.tastyties.cooking_class.dto;

import com.teamcook.tastyties.cooking_class.constant.RabbitMQUserType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Builder
public class RabbitMQUserDTO {
    private int id;
    private RabbitMQUserType type;
    private String nickname;
    private String language;
    private Instant enteredTime;

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof RabbitMQUserDTO) {
            return this.id == ((RabbitMQUserDTO) obj).id;
        }

        return false;
    }

}
