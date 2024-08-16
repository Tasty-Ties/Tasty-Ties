package com.teamcook.tastyties.user.repository.statistics;

import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.entity.UserStatistics;

public interface UserStatisticsCustomRepository {
    UserStatistics getUserStatistics(User user);
}
