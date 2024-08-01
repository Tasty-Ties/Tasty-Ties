package com.teamcook.tastyties.cooking_class.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class DeletedCookingClassDto {
    private String chatRoomId;
    private long deletedReservationCount;
}
