package com.teamcook.tastyties.cooking_class.repository;

import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CookingClassTagRepository extends JpaRepository<CookingClassTag, Integer> {

    Optional<CookingClassTag> findByCookingClassTagName(String name);
}
