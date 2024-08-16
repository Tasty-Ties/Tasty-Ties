package com.teamcook.tastyties.cooking_class.repository;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CookingClassRepository extends JpaRepository<CookingClass, Integer>, CookingClassCustomRepository{

    // 간단한 정보만 빼옴 lazy 활용
    CookingClass findByUuid(String uuid);
}
