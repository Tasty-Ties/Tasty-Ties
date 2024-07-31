package com.teamcook.tastyties.shared.repository;

import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.dto.UserProfileForClassDetailDto;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface UserAndCookingClassCustomRepository {

    UserAndCookingClass getUserAndCookingClass();

    boolean isUserEnrolledInClass(User user, CookingClass cookingClass);
    Long countQuota(CookingClass cookingClass);
    Set<UserProfileForClassDetailDto> findUserEnrolledInClass(CookingClass cookingClass);

    boolean deleteReservation(User user, CookingClass cookingClass);

    Page<CookingClassListDto> findReservedClassesByUserId(int userId, Pageable pageable);
}
