package com.teamcook.tastyties.cooking_class.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import com.teamcook.tastyties.cooking_class.entity.QCookingClassTag;

import static com.teamcook.tastyties.cooking_class.entity.QCookingClassTag.cookingClassTag;

public class CookingClassRepositoryImpl implements CookingClassCustomRepository {

    private final JPAQueryFactory queryFactory;

    public CookingClassRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public void registerClass() {

    }

    @Override
    public CookingClassTag findTag(String tagName) {
        return queryFactory
                .selectFrom(cookingClassTag)
                .where(cookingClassTag.cookingClassTagName.eq(tagName))
                .fetchOne();
    }
}
