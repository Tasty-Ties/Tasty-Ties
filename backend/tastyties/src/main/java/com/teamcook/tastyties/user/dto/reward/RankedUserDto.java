package com.teamcook.tastyties.user.dto.reward;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RankedUserDto {
    private int userId;
    private String username;
    private String nickname;
    private double score;
    private int rank;
    private int classesHosted;
    private int classesAttended;
    private String profileImageUrl;
    private String description;

    public RankedUserDto(int userId, String username, String nickname, int classesHosted, int classesAttended,
                         String profileImageUrl, String description, double score) {
        this.userId = userId;
        this.nickname = nickname;
        this.classesHosted = classesHosted;
        this.classesAttended = classesAttended;
        this.profileImageUrl = profileImageUrl;
        this.description = description;
        this.score = score;
    }
}
