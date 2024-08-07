package com.teamcook.tastyties.user.dto.reward;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RankedUserDto {
    private int userId;
    private String nickname;
    private double score;
    private int rank;
    private int classesHosted;
    private int classesAttended;
    private String profileImageUrl;
    private String description;
}
