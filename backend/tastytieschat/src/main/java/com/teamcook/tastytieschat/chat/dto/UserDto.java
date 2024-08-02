package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.UserType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class UserDto {
    private int id;
    private UserType type;
    private String nickname;
    private String language;
    private Instant enteredTime;

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof UserDto) {
            return this.id == ((UserDto) obj).id;
        }

        return false;
    }

}
