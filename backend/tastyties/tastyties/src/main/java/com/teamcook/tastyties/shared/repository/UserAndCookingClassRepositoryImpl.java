package com.teamcook.tastyties.shared.repository;

import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.QCookingClassListDto;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.QCookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.dto.QUserProfileForClassDetailDTO;
import com.teamcook.tastyties.user.dto.UserProfileForClassDetailDTO;
import com.teamcook.tastyties.user.entity.QUser;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Override
    public Set<UserProfileForClassDetailDTO> findUserEnrolledInClass(CookingClass cookingClass) {
        return new HashSet<>(queryFactory
                .select(new QUserProfileForClassDetailDTO(
                        user.profileImageUrl,
                        user.nickname,
                        user.username))
                .from(userAndCookingClass)
                .join(userAndCookingClass.user, user)
                .where(userAndCookingClass.cookingClass.eq(cookingClass))
                .fetch());
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
        List<CookingClassListDto> results = queryFactory
                .select(new QCookingClassListDto(
                        cookingClass.title,
                        cookingClass.cookingClassStartTime.as("startTime"),
                        cookingClass.cookingClassEndTime.as("endTime"),
                        user.nickname.as("hostName"),
                        cookingClass.uuid, null))
                .from(userAndCookingClass)
                .join(userAndCookingClass.cookingClass, cookingClass)
                .join(userAndCookingClass.user, user)
                .where(userAndCookingClass.user.userId.eq(userId))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(userAndCookingClass.count())
                .from(userAndCookingClass)
                .where(userAndCookingClass.user.userId.eq(userId));

        return PageableExecutionUtils.getPage(results, pageable, countQuery::fetchOne);
    }
}
