package com.teamcook.tastyties.cooking_class.repository;

import com.teamcook.tastyties.cooking_class.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeRepository extends JpaRepository<Recipe, Integer> {

}
