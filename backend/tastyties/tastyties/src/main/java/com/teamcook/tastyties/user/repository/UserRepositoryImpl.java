package com.teamcook.tastyties.user.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.common.entity.QCountry;
import com.teamcook.tastyties.common.entity.QLanguage;
import com.teamcook.tastyties.shared.entity.QUserAndCountry;
import com.teamcook.tastyties.user.entity.QUser;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;

import static com.teamcook.tastyties.common.entity.QCountry.country;
import static com.teamcook.tastyties.common.entity.QLanguage.language;
import static com.teamcook.tastyties.shared.entity.QUserAndCountry.userAndCountry;
import static com.teamcook.tastyties.user.entity.QUser.user;

public class UserRepositoryImpl implements UserRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public UserRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    public User findUserWithCollectedFlags(Integer userId) {
        QCountry collectedCountry = new QCountry("collectedCountry"); // 다른 별칭 사용
        return queryFactory
                .selectFrom(user)
                .leftJoin(user.language, language).fetchJoin()            // User의 Language 페치 조인
                .leftJoin(user.country, country).fetchJoin()              // User의 Country 페치 조인
                .leftJoin(user.userAndCountries, userAndCountry).fetchJoin()
                .leftJoin(userAndCountry.country, collectedCountry).fetchJoin() // UserAndCountry와 관련된 Country 페치 조인
                .where(user.userId.eq(userId))
                .fetchOne();
    }

}
