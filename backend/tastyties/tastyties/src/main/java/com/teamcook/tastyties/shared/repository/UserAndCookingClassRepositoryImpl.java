package com.teamcook.tastyties.shared.repository;

import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.common.dto.QCountryProfileDto;
import com.teamcook.tastyties.common.entity.QCountry;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.QCookingClassListDto;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.shared.dto.QReviewResponseDto;
import com.teamcook.tastyties.shared.dto.ReviewResponseDto;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.dto.QUserSimpleProfileDto;
import com.teamcook.tastyties.user.dto.UserSimpleProfileDto;
import com.teamcook.tastyties.user.entity.QUser;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.teamcook.tastyties.common.entity.QCountry.country;
import static com.teamcook.tastyties.cooking_class.entity.QCookingClass.cookingClass;
import static com.teamcook.tastyties.shared.entity.QUserAndCookingClass.userAndCookingClass;
import static com.teamcook.tastyties.user.entity.QUser.user;

public class UserAndCookingClassRepositoryImpl implements UserAndCookingClassCustomRepository{

    private final JPAQueryFactory queryFactory;

    public UserAndCookingClassRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }


    @Override
    public UserAndCookingClass getUserAndCookingClass() {
        return null;
    }

    // 유저가 해당 클래스에 예약을 한 상태인지 확인
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


    // 현재 클래스의 인원 확인
    @Override
    public Long countQuota(CookingClass cookingClass) {
        return queryFactory
            .select(userAndCookingClass.count())
                .from(userAndCookingClass)
                .where(userAndCookingClass.cookingClass.eq(cookingClass))
                .fetchOne();
    }

    // 해당 클래스 참여자 정보 확인
    @Override
    public Set<UserSimpleProfileDto> findUserEnrolledInClass(CookingClass cookingClass) {
        return new HashSet<>(queryFactory
                .select(new QUserSimpleProfileDto(
                        user.profileImageUrl,
                        user.nickname,
                        user.username))
                .from(userAndCookingClass)
                .join(userAndCookingClass.user, user)
                .where(userAndCookingClass.cookingClass.eq(cookingClass))
                .fetch());
    }

    @Override
    public long deleteCookingClass(CookingClass cookingClass) {
        return queryFactory
                .delete(userAndCookingClass)
                .where(userAndCookingClass.cookingClass.eq(cookingClass))
                .execute();
    }

    @Override
    public boolean deleteReservation(User user, CookingClass cookingClass) {
        long row = queryFactory
                .delete(userAndCookingClass)
                .where(userAndCookingClass.cookingClass.eq(cookingClass),
                        userAndCookingClass.user.eq(user))
                .execute();

        if (row == 0) {
            throw new IllegalArgumentException("존재하지 않는 예약입니다.");
        }
        return true;
    }

    @Override
    public Page<CookingClassListDto> findReservedClassesByUserId(int userId, Pageable pageable) {
        QUser host = new QUser("host");
        QCountry countryByClass = new QCountry("countryByClass");
        List<CookingClassListDto> results = queryFactory
                .select(
                        new QCookingClassListDto(
                        cookingClass.title, cookingClass.mainImage,
                        cookingClass.cookingClassStartTime.as("startTime"),
                        cookingClass.cookingClassEndTime.as("endTime"),
                        host.nickname.as("hostName"),
                        cookingClass.uuid,
                        new QCountryProfileDto(
                                country.alpha2,
                                country.countryImageUrl
                        ),
                                new QCountryProfileDto(
                                        countryByClass.alpha2,
                                        countryByClass.countryImageUrl
                                ),
                                cookingClass.countryCode.eq(country.alpha2)
                ))
                .from(userAndCookingClass)
                .join(userAndCookingClass.cookingClass, cookingClass)
                .join(userAndCookingClass.user, user)
                .join(cookingClass.host, host)
                .leftJoin(host.country, country)
                .leftJoin(countryByClass).on(cookingClass.countryCode.eq(countryByClass.alpha2))
                .where(userAndCookingClass.user.userId.eq(userId))
                .orderBy(cookingClass.cookingClassStartTime.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(userAndCookingClass.count())
                .from(userAndCookingClass)
                .where(userAndCookingClass.user.userId.eq(userId));

        return PageableExecutionUtils.getPage(results, pageable, countQuery::fetchOne);
    }

    @Override
    public Set<CookingClassListDto> findReservedClassesForProfile(int userId) {
        QUser host = new QUser("host");
        QCountry countryByClass = new QCountry("countryByClass");
        return new HashSet<>(queryFactory
                .select(
                        new QCookingClassListDto(
                                cookingClass.title, cookingClass.mainImage,
                                cookingClass.cookingClassStartTime.as("startTime"),
                                cookingClass.cookingClassEndTime.as("endTime"),
                                host.nickname.as("hostName"),
                                cookingClass.uuid,
                                new QCountryProfileDto(
                                        country.alpha2,
                                        country.countryImageUrl
                                ),
                                new QCountryProfileDto(
                                        countryByClass.alpha2,
                                        countryByClass.countryImageUrl
                                ),
                                cookingClass.countryCode.eq(country.alpha2)
                        ))
                .from(userAndCookingClass)
                .join(userAndCookingClass.cookingClass, cookingClass)
                .join(userAndCookingClass.user, user)
                .join(cookingClass.host, host)
                .leftJoin(host.country, country)
                .leftJoin(countryByClass).on(cookingClass.countryCode.eq(countryByClass.alpha2))
                .where(userAndCookingClass.user.userId.eq(userId))
                .orderBy(cookingClass.cookingClassStartTime.asc())
                .limit(4)
                .fetch()
        );
    }

    @Override
    public Page<ReviewResponseDto> findReviewsForCookingClass(String uuid, Pageable pageable) {
        List<ReviewResponseDto> results = queryFactory
                .select(new QReviewResponseDto(
                        cookingClass.title, userAndCookingClass.cookingClassReview,
                        userAndCookingClass.cookingClassReviewCreateTime,
                        cookingClass.mainImage, country.countryImageUrl, user.nickname
                )).from(userAndCookingClass)
                .join(userAndCookingClass.user, user)
                .join(userAndCookingClass.cookingClass, cookingClass)
                .leftJoin(country).on(cookingClass.countryCode.eq(country.alpha2))
                .where(cookingClass.uuid.eq(uuid))
                .orderBy(userAndCookingClass.cookingClassReviewCreateTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory.select(userAndCookingClass.count())
                .from(userAndCookingClass)
                .leftJoin(userAndCookingClass.cookingClass, cookingClass)
                .where(cookingClass.uuid.eq(uuid));

        return PageableExecutionUtils.getPage(results, pageable, countQuery::fetchOne);
    }

    @Override
    public List<ReviewResponseDto> findReviewsForCookingClass(int hostId) {
        QUser host = new QUser("host");
        return queryFactory
                .select(new QReviewResponseDto(
                        cookingClass.title, userAndCookingClass.cookingClassReview,
                        userAndCookingClass.cookingClassReviewCreateTime,
                        cookingClass.mainImage, country.countryImageUrl, user.nickname
                )).from(userAndCookingClass)
                .join(userAndCookingClass.user, user)
                .join(userAndCookingClass.cookingClass, cookingClass)
                .join(cookingClass.host, host)
                .leftJoin(country).on(cookingClass.countryCode.eq(country.alpha2))
                .where(host.userId.eq(hostId))
                .orderBy(userAndCookingClass.cookingClassReviewCreateTime.desc())
                .limit(3)
                .fetch();
    }

    // 예약정보 조회
    @Override
    public UserAndCookingClass findReservationByUsernameAndClassUuid(int userId, String uuid) {
        return queryFactory
                .selectFrom(userAndCookingClass)
                .join(userAndCookingClass.user, user)
                .join(userAndCookingClass.cookingClass, cookingClass)
                .where(
                        userAndCookingClass.user.userId.eq(userId),
                        cookingClass.uuid.eq(uuid)
                )
                .fetchOne();
    }
}
