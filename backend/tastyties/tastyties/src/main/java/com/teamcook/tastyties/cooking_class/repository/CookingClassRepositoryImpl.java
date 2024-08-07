package com.teamcook.tastyties.cooking_class.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.common.dto.country.QCountryProfileDto;
import com.teamcook.tastyties.common.entity.QCountry;
import com.teamcook.tastyties.cooking_class.dto.*;
import com.teamcook.tastyties.cooking_class.entity.*;
import com.teamcook.tastyties.shared.entity.CookingClassAndCookingClassTag;
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
import static com.teamcook.tastyties.cooking_class.entity.QCookingClassImage.cookingClassImage;
import static com.teamcook.tastyties.cooking_class.entity.QCookingClassTag.cookingClassTag;
import static com.teamcook.tastyties.cooking_class.entity.QCookingTool.cookingTool;
import static com.teamcook.tastyties.cooking_class.entity.QIngredient.ingredient;
import static com.teamcook.tastyties.cooking_class.entity.QRecipe.recipe;
import static com.teamcook.tastyties.shared.entity.QUserAndCookingClass.userAndCookingClass;
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
                .select(new QCookingClassListDto(cookingClass.title, cookingClass.mainImage,
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
        CookingClass result = queryFactory
                .selectFrom(cookingClass)
                .leftJoin(cookingClass.host, user).fetchJoin()
                .leftJoin(cookingClass.recipes, recipe).fetchJoin()
                .leftJoin(cookingClass.ingredients, ingredient).fetchJoin()
                .leftJoin(cookingClass.cookingTools, cookingTool).fetchJoin()
                .leftJoin(cookingClass.cookingClassImages, cookingClassImage).fetchJoin()
                .where(cookingClass.uuid.eq(uuid), cookingClass.isDelete.eq(false))
                .fetchOne();
        if (result != null) {
            // 다대다 관계는 별도의 쿼리로 로드하여 엔티티에 추가
            List<CookingClassAndCookingClassTag> tags = fetchCookingClassTags(result.getCookingClassId());
            result.setCookingClassAndCookingClassTags(tags);
        }
        return result;
    }

    private List<CookingClassAndCookingClassTag> fetchCookingClassTags(int cookingClassId) {
        QCookingClassAndCookingClassTag ccAndTag = QCookingClassAndCookingClassTag.cookingClassAndCookingClassTag;

        return queryFactory
                .selectFrom(ccAndTag)
                .leftJoin(ccAndTag.cookingClassTag, cookingClassTag).fetchJoin()
                .where(ccAndTag.cookingClass.cookingClassId.eq(cookingClassId))
                .fetch();
    }

    @Override
    public CookingClassDto findCookingClassDtoWithUuid(String uuid) {
        return null;
    }

//    @Override
//    public CookingClassDto findCookingClassDtoWithUuid(String uuid) {
//        QCookingClassAndCookingClassTag ccAndTag = QCookingClassAndCookingClassTag.cookingClassAndCookingClassTag;
//        Set<RecipeDto> recipeNames = new HashSet<>(queryFactory
//                .select(new QRecipeDto(
//                        recipe.step, recipe.description
//                )).from(recipe)
//                .where(recipe.cookingClass.cookingClassId.eq(cookingClass.cookingClassId))
//                .fetch());
//
//        Set<IngredientDto> ingredientNames = new HashSet<>(queryFactory
//                .select(new QIngredientDto(
//                        ingredient.ingredientName, ingredient.quantity,
//                        ingredient.quantityUnit, ingredient.isRequired
//                ))
//                .from(ingredient)
//                .where(ingredient.cookingClass.cookingClassId.eq(cookingClass.cookingClassId))
//                .fetch());
//
//        Set<String> cookingToolNames = new HashSet<>(queryFactory
//                .select(cookingTool.cookingToolName)
//                .from(cookingTool)
//                .where(cookingTool.cookingClass.cookingClassId.eq(cookingClass.cookingClassId))
//                .fetch());
//
//        List<String> imageUrls = queryFactory
//                .select(cookingClassImage.cookingClassImageUrl)
//                .from(cookingClassImage)
//                .where(cookingClassImage.cookingClass.cookingClassId.eq(cookingClass.cookingClassId))
//                .fetch();
//
//        List<String> tagNames = queryFactory
//                .select(cookingClassTag.cookingClassTagName)
//                .from(ccAndTag)
//                .leftJoin(ccAndTag.cookingClassTag, cookingClassTag)
//                .where(ccAndTag.cookingClass.cookingClassId.eq(cookingClass.cookingClassId))
//                .fetch();
//
//        return queryFactory
//                .select(new QCookingClass.class,
//        cookingClass.cookingClassId,
//                cookingClass.uuid,
//                cookingClass.title,
//                user.username,
//                recipeNames,
//                ingredientNames,
//                cookingToolNames,
//                imageUrls,
//                tagNames))
//                .from(cookingClass)
//                .leftJoin(cookingClass.host, user)
//                .where(cookingClass.uuid.eq(uuid), cookingClass.isDelete.eq(false))
//                .fetchOne()
//    }

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
                        cookingClass.title, cookingClass.mainImage,
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

    // 남이 보는 프로필에 사용되는 진행한 클래스 정보
    @Override
    public Set<CookingClassListDto> searchClassByHostIdForProfile(int hostId) {
        QCountry countryByClass = new QCountry("countryByClass");
        return new HashSet<>(
                queryFactory
                        .select(new QCookingClassListDto(
                                cookingClass.title, cookingClass.mainImage,
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

    @Override
    public boolean isCookingClassGuest(Integer userId, String uuid) {
        Long count = queryFactory
                .select(userAndCookingClass.count())
                .from(userAndCookingClass)
                .leftJoin(userAndCookingClass.cookingClass, cookingClass)
                .where(cookingClass.uuid.eq(uuid)
                        .and(userAndCookingClass.user.userId.eq(userId)))
                .fetchOne();
        return count != null && count > 0;
    }

    @Override
    public String findSessionIdWidthUuid(String uuid) {
        CookingClass cookingClass = queryFactory
                .selectFrom(QCookingClass.cookingClass)
                .where(QCookingClass.cookingClass.uuid.eq(uuid))
                .fetchOne();
        return cookingClass != null ? cookingClass.getSessionId() : null;
    }

}
