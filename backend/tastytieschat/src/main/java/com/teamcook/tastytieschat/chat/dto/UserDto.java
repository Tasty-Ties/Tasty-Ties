package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.UserType;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserDto {
    private UserType type;
    private String username;
    private String nickname;
    private String language;
    private String profileImageUrl;
    private LocalDateTime enteredTime;

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof UserDto) {
            return this.username.equals(((UserDto) obj).username);
        }

        return false;
    }

}
