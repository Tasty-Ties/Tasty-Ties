package com.teamcook.tastyties.shared.repository;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.entity.User;

public interface UserAndCookingClassCustomRepository {

    UserAndCookingClass getUserAndCookingClass();

    boolean isUserEnrolledInClass(User user, CookingClass cookingClass);
    Long countQuota(CookingClass cookingClass);
}
