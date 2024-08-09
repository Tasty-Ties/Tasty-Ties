package com.teamcook.tastyties.cooking_class.dto;

import com.teamcook.tastyties.user.dto.UserFcmTokenDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ReservedCookingClassDto {
    private String className;
    private UserFcmTokenDto host;
    private String chatRoomId;
}
