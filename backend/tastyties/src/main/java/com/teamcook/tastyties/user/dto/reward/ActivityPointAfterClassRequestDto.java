package com.teamcook.tastyties.user.dto.reward;

import lombok.Data;

@Data
public class ActivityPointAfterClassRequestDto {
    private ActivityPointRequestDto activityPointRequestDto;
    private boolean isHost;
}
