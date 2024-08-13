package com.teamcook.tastyties.user.repository.activitypoint;

import com.teamcook.tastyties.user.dto.reward.ActivityPointLogResponseDto;
import com.teamcook.tastyties.user.dto.reward.ActivityPointResponseDto;
import com.teamcook.tastyties.user.entity.User;

import java.util.List;

public interface ActivityPointLogCustomRepository {
    List<ActivityPointLogResponseDto> findActivityPointLogForProfile(User me, int period);
}
