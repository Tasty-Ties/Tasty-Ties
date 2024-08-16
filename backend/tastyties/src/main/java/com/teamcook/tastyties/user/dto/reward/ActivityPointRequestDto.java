package com.teamcook.tastyties.user.dto.reward;

import lombok.Data;

@Data
public class ActivityPointRequestDto {
    private int userId;
    private double score;
    private String description;
}
