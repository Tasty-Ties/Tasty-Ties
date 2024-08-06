package com.teamcook.tastyties.cooking_class.dto;

import com.teamcook.tastyties.user.dto.UserFcmTokenDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter
@AllArgsConstructor
@Builder
public class DeletedCookingClassDto {
    private String className;
    private Set<UserFcmTokenDto> users;
    private String chatRoomId;
    private long deletedReservationCount;
}
