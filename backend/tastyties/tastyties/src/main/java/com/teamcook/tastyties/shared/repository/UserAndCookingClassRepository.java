package com.teamcook.tastyties.shared.repository;

import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAndCookingClassRepository extends JpaRepository<UserAndCookingClass, Integer> , UserAndCookingClassCustomRepository{
}
