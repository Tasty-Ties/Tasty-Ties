package com.teamcook.tastyties.shared.repository;

import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.shared.dto.ReviewResponseDto;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.dto.UserProfileForClassDetailDto;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;
import java.util.Set;

public interface UserAndCookingClassCustomRepository {

    UserAndCookingClass getUserAndCookingClass();

    boolean isUserEnrolledInClass(User user, CookingClass cookingClass);
    Long countQuota(CookingClass cookingClass);
    Set<UserProfileForClassDetailDto> findUserEnrolledInClass(CookingClass cookingClass);

    long deleteCookingClass(CookingClass cookingClass);
    boolean deleteReservation(User user, CookingClass cookingClass);

    Page<CookingClassListDto> findReservedClassesByUserId(int userId, Pageable pageable);
    Set<CookingClassListDto> findReservedClassesForProfile(int userId);

    Page<ReviewResponseDto> findReviewsForCookingClass(String uuid, Pageable pageable);
    List<ReviewResponseDto> findReviewsForCookingClass(int userId);


    UserAndCookingClass findReservationByUsernameAndClassUuid(int userId, String uuid);
}
