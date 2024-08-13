package com.teamcook.tastyties.user.repository.activitypoint;

import com.teamcook.tastyties.user.entity.ActivityPointLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityPointLogRepository extends JpaRepository<ActivityPointLog, Integer>, ActivityPointLogCustomRepository {
}
