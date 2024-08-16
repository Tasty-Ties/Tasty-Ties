package com.teamcook.tastyties.user.dto.reward;

import lombok.Data;

@Data
public class ActivityPointRequestByUsernameDto {
    private String username;
    private double score;
    private String description;
}
