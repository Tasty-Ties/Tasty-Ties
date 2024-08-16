package com.teamcook.tastyties.user.repository.statistics;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.user.entity.QUserStatistics;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.entity.UserStatistics;
import lombok.RequiredArgsConstructor;

import static com.teamcook.tastyties.user.entity.QUserStatistics.userStatistics;

@RequiredArgsConstructor
public class UserStatisticsRepositoryImpl implements UserStatisticsCustomRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public UserStatistics getUserStatistics(User user) {
        return queryFactory
                .selectFrom(userStatistics)
                .where(userStatistics.user.eq(user)).fetchOne();
    }
}
