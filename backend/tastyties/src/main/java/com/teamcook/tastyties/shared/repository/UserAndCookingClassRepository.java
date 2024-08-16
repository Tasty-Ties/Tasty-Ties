package com.teamcook.tastyties.shared.repository;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAndCookingClassRepository extends JpaRepository<UserAndCookingClass, Integer>, UserAndCookingClassCustomRepository {

    public void deleteAllByUser(User user);
}
