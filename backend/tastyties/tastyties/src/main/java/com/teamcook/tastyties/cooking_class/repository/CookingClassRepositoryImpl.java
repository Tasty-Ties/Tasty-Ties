package com.teamcook.tastyties.cooking_class.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.common.dto.QCountryProfileDto;
import com.teamcook.tastyties.common.entity.QCountry;
import com.teamcook.tastyties.cooking_class.dto.*;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import com.teamcook.tastyties.shared.entity.QCookingClassAndCookingClassTag;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.teamcook.tastyties.common.entity.QCountry.country;
import static com.teamcook.tastyties.cooking_class.entity.QCookingClass.cookingClass;
import static com.teamcook.tastyties.cooking_class.entity.QCookingClassTag.cookingClassTag;
import static com.teamcook.tastyties.user.entity.QUser.user;
import static org.springframework.util.StringUtils.hasText;

@Slf4j
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

    // 클래스 목록 검색
    // 동적 쿼리 사용
    @Override
    public Page<CookingClassListDto> searchClass(CookingClassSearchCondition condition, Pageable pageable) {
        QCountry countryByClass = new QCountry("countryByClass");
        List<CookingClassListDto> results = queryFactory
                .select(new QCookingClassListDto(cookingClass.title,
                        cookingClass.cookingClassStartTime.as("startTime"),
                        cookingClass.cookingClassEndTime.as("endTime"),
                        user.nickname.as("hostName"),
                        cookingClass.uuid,
                        new QCountryProfileDto(
                                country.alpha2,
                                country.countryImageUrl
                        ), new QCountryProfileDto(
                        countryByClass.alpha2,
                        countryByClass.countryImageUrl
                ),
                        cookingClass.countryCode.eq(country.alpha2)
                ))
                .from(cookingClass)
                .leftJoin(cookingClass.host, user)
                .leftJoin(user.country, country)
                .leftJoin(countryByClass).on(cookingClass.countryCode.eq(countryByClass.alpha2))
                .where(
                        cookingClass.isDelete.eq(false),
                        titleLike(condition.getTitle()),
                        usernameEq(condition.getUsername()),
                        useLocalFilter(condition.isUseLocalFilter()),
                        countryCodeEq(condition.getCountryCode()),
                        languageCodeEq(condition.getLanguageCode())
                )
                .orderBy(getOrderSpecifiers(pageable.getSort()))
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

    // 제목 like 필터
    private BooleanExpression titleLike(String title) {
        return hasText(title) ? cookingClass.title.contains(title) : null;
    }

    // username equal 필터
    private BooleanExpression usernameEq(String username) {
        return hasText(username) ? user.username.eq(username) : null;
    }

    // 현지인 필터
    private BooleanExpression useLocalFilter(Boolean useLocalFilter) {
        // 필터가 true이면 필터링 적용, 아니면 null 반환하여 조건에서 제외
        return Boolean.TRUE.equals(useLocalFilter) ? cookingClass.countryCode.eq(country.alpha2) : null;
    }

    // 나라 코드 필터
    private BooleanExpression countryCodeEq(String countryCode) {
        return hasText(countryCode) ? cookingClass.countryCode.eq(countryCode) : null;
    }

    // 언어 코드 필터
    private BooleanExpression languageCodeEq(String languageCode) {
        return hasText(languageCode) ? cookingClass.languageCode.eq(languageCode) : null;
    }

    private OrderSpecifier<?>[] getOrderSpecifiers(Sort sort) {
        return sort.stream()
                .map(order -> {
                    PathBuilder pathBuilder = new PathBuilder(cookingClass.getType(), cookingClass.getMetadata());
                    return new OrderSpecifier(
                            order.isAscending() ? Order.ASC : Order.DESC,
                            pathBuilder.get(order.getProperty())
                    );
                })
                .toArray(OrderSpecifier[]::new);
    }

    // 클래스 상세 조회
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

    @Override
    public CookingClass findClassForDelete(String uuid) {
        return queryFactory
                .selectFrom(cookingClass)
                .leftJoin(cookingClass.host).fetchJoin()
                .where(cookingClass.uuid.eq(uuid))
                .fetchOne();
    }

    @Override
    public Page<CookingClassListDto> searchClassByHostId(int hostId, Pageable pageable) {
        QCountry countryByClass = new QCountry("countryByClass");
        List<CookingClassListDto> results = queryFactory
                .select(new QCookingClassListDto(
                        cookingClass.title,
                        cookingClass.cookingClassStartTime.as("startTime"),
                        cookingClass.cookingClassEndTime.as("endTime"),
                        user.nickname.as("hostName"),
                        cookingClass.uuid,
                        new QCountryProfileDto(
                                country.alpha2,
                                country.countryImageUrl
                        ), new QCountryProfileDto(
                        countryByClass.alpha2,
                        countryByClass.countryImageUrl
                ), cookingClass.countryCode.eq(country.alpha2)
                ))
                .from(cookingClass)
                .leftJoin(cookingClass.host, user)
                .leftJoin(user.country, country)
                .leftJoin(countryByClass).on(cookingClass.countryCode.eq(countryByClass.alpha2))
                .where(
                        cookingClass.isDelete.eq(false),
                        cookingClass.host.userId.eq(hostId))
                .orderBy(cookingClass.cookingClassStartTime.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(cookingClass.count())
                .from(cookingClass)
                .where(cookingClass.host.userId.eq(hostId));

        return PageableExecutionUtils.getPage(results, pageable, countQuery::fetchOne);
    }

    @Override
    public Set<CookingClassListDto> searchClassByHostIdForProfile(int hostId) {
        return new HashSet<>(
                queryFactory
                        .select(new QCookingClassListDto(
                                cookingClass.title,
                                cookingClass.cookingClassStartTime.as("startTime"),
                                cookingClass.cookingClassEndTime.as("endTime"),
                                user.nickname.as("hostName"),
                                cookingClass.uuid,
                                new QCountryProfileDto(
                                        country.alpha2,
                                        country.countryImageUrl
                                ), new QCountryProfileDto(
                                country.alpha2,
                                country.countryImageUrl
                        ),
                                cookingClass.countryCode.eq(country.alpha2)
                        ))
                        .from(cookingClass)
                        .leftJoin(cookingClass.host, user)
                        .leftJoin(user.country, country)
                        .where(
                                cookingClass.isDelete.eq(false),
                                cookingClass.host.userId.eq(hostId))
                        .orderBy(cookingClass.cookingClassStartTime.asc())
                        .limit(4)
                        .fetch()
        );
    }

    @Override
    public boolean isCookingClassHost(int hostId, String uuid) {
        Long count = queryFactory
                .select(cookingClass.count())
                .from(cookingClass)
                .where(cookingClass.uuid.eq(uuid)
                        .and(cookingClass.host.userId.eq(hostId)))
                .fetchOne();
        return count != null && count > 0;
    }

    @Override
    @Transactional
    public void updateSessionIdByCookingClassId(String sessionId, String uuid) {
        queryFactory.update(cookingClass)
                .set(cookingClass.sessionId, sessionId)
                .where(cookingClass.uuid.eq(uuid))
                .execute();
    }

}
