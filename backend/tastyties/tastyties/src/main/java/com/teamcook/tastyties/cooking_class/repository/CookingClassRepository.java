package com.teamcook.tastyties.cooking_class.repository;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CookingClassRepository extends JpaRepository<CookingClass, Integer>, CookingClassCustomRepository{

    CookingClass findByUuid(String uuid);
}
