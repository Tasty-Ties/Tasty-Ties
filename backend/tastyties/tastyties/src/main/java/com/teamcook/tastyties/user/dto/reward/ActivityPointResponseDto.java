package com.teamcook.tastyties.user.dto.reward;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ActivityPointResponseDto {
    private List<RankedUserDto> rankedUsers;
    private RankedUserDto myRanked;
    private int totalPage;
}
