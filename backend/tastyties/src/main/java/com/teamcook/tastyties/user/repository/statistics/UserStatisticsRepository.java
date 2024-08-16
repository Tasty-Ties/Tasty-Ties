package com.teamcook.tastyties.user.repository.statistics;

import com.teamcook.tastyties.user.entity.UserStatistics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserStatisticsRepository extends JpaRepository<UserStatistics, Integer>, UserStatisticsCustomRepository {
}
