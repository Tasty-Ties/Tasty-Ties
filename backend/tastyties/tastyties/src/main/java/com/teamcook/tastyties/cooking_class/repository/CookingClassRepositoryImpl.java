package com.teamcook.tastyties.cooking_class.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.cooking_class.dto.*;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import com.teamcook.tastyties.cooking_class.entity.QCookingClassTag;
import com.teamcook.tastyties.shared.entity.QCookingClassAndCookingClassTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.teamcook.tastyties.cooking_class.entity.QCookingClass.cookingClass;
import static com.teamcook.tastyties.cooking_class.entity.QCookingClassTag.cookingClassTag;
import static com.teamcook.tastyties.user.entity.QUser.user;
import static org.springframework.util.StringUtils.hasText;

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

    // 제목, 호스트name을 통한 검색목록 반환
    // 동적 쿼리 사용
    @Override
    public Page<CookingClassListDto> searchClass(CookingClassSearchCondition condition, Pageable pageable) {
        List<CookingClassListDto> results = queryFactory
                .select(new QCookingClassListDto(cookingClass.title,
                        cookingClass.cookingClassStartTime.as("startTime"),
                        cookingClass.cookingClassEndTime.as("endTime"),
                        user.username.as("hostName"),
                        cookingClass.uuid))
                .from(cookingClass)
                .leftJoin(cookingClass.host, user)
                .where(
                        titleLike(condition.getTitle()),
                        usernameEq(condition.getUsername())
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory.select(cookingClass.count())
                .from(cookingClass)
                .leftJoin(cookingClass.host, user)
                .where(
                        titleLike(condition.getTitle()),
                        usernameEq(condition.getUsername()));


        return PageableExecutionUtils.getPage(results, pageable, countQuery::fetchOne);
    }

    // fetchjoin을 사용한 조회
    @Override
    public CookingClass findWithUuid(String uuid) {
        QCookingClassAndCookingClassTag ccAndTag = QCookingClassAndCookingClassTag.cookingClassAndCookingClassTag;

        return queryFactory
                .selectFrom(cookingClass)
                .leftJoin(cookingClass.host).fetchJoin()
                .leftJoin(cookingClass.recipes).fetchJoin()
                .leftJoin(cookingClass.ingredients).fetchJoin()
                .leftJoin(cookingClass.cookingTools).fetchJoin()
                .leftJoin(cookingClass.cookingClassAndCookingClassTags, ccAndTag).fetchJoin()
                .leftJoin(ccAndTag.cookingClassTag, cookingClassTag).fetchJoin()
                .where(cookingClass.uuid.eq(uuid), cookingClass.isDelete.eq(false))
                .fetchOne();
    }

    private BooleanExpression titleLike(String title) {
        return hasText(title) ? cookingClass.title.contains(title) : null;
    }

    private BooleanExpression usernameEq(String username) {
        return hasText(username) ?user.username.eq(username) : null;
    }

}
