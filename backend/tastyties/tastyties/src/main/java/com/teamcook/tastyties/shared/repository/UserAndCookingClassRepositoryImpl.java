package com.teamcook.tastyties.shared.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.entity.User;

import static com.teamcook.tastyties.shared.entity.QUserAndCookingClass.userAndCookingClass;

public class UserAndCookingClassRepositoryImpl implements UserAndCookingClassCustomRepository{

    private final JPAQueryFactory queryFactory;

    public UserAndCookingClassRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }


    @Override
    public UserAndCookingClass getUserAndCookingClass() {
        return null;
    }

    @Override
    public boolean isUserEnrolledInClass(User user, CookingClass cookingClass) {
        Integer count = queryFactory
                .selectOne()
                .from(userAndCookingClass)
                .where(userAndCookingClass.cookingClass.eq(cookingClass)
                        .and(userAndCookingClass.user.eq(user)))
                .fetchFirst(); // fetchOne() 대신 fetchFirst()를 사용하여 존재 여부만 확인

        return count != null;
    }


    @Override
    public Long countQuota(CookingClass cookingClass) {
        return queryFactory
            .select(userAndCookingClass.count())
                .from(userAndCookingClass)
                .where(userAndCookingClass.cookingClass.eq(cookingClass))
                .fetchOne();
    }
}
