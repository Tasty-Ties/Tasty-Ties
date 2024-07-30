package com.teamcook.tastyties.shared.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.shared.entity.QUserAndCountry;
import com.teamcook.tastyties.user.entity.User;
import static com.teamcook.tastyties.shared.entity.QUserAndCountry.userAndCountry;

public class UserAndCountryRepositoryImpl implements UserAndCountryCustomRepository {

    private final JPAQueryFactory queryFactory;

    public UserAndCountryRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    // 국기가 현재 수집되었는지 확인
    @Override
    public boolean alreadyCollected(User user, Country country) {
        Integer count = queryFactory
                .selectOne()
                .from(userAndCountry)
                .where(userAndCountry.user.eq(user)
                        .and(userAndCountry.country.eq(country)))
                .fetchFirst();
        return count != null;
    }
}
