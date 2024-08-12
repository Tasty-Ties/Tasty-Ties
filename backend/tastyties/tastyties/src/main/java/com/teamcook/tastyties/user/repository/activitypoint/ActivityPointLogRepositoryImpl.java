package com.teamcook.tastyties.user.repository.activitypoint;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.user.dto.reward.ActivityPointLogResponseDto;
import com.teamcook.tastyties.user.dto.reward.QActivityPointLogResponseDto;
import com.teamcook.tastyties.user.entity.QActivityPointLog;
import com.teamcook.tastyties.user.entity.User;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import static com.teamcook.tastyties.user.entity.QActivityPointLog.activityPointLog;

@RequiredArgsConstructor
public class ActivityPointLogRepositoryImpl implements ActivityPointLogCustomRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ActivityPointLogResponseDto> findActivityPointLogForProfile(User me, int period) {
        LocalDateTime startDate = LocalDateTime.now().minusMonths(period);

        return queryFactory.select(
                        new QActivityPointLogResponseDto(
                                activityPointLog.transactionDate,
                                activityPointLog.amount,
                                activityPointLog.totalPoint,
                                activityPointLog.description
                        ))
                .from(activityPointLog)
                .where(activityPointLog.user.eq(me),
                        activityPointLog.transactionDate.after(startDate))
                .fetch();
    }
}
