package com.teamcook.tastyties.cooking_class.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
public class CookingClassDto {
    private String uuid;
    private String title;
    private String dishName;
    private boolean isLimitedAge;
    private String countryCode;
    private Set<String> cookingClassTags;
    private String description;
    private String languageCode;
    private int level;
    private LocalDateTime cookingClassStartTime;
    private LocalDateTime cookingClassEndTime;
    private int dishCookingTime;
    private Set<IngredientDto> ingredients;
    private Set<RecipeDto> recipe;
    private Set<String> cookingTools;
    private int quota;
    private LocalDateTime replayEndTime;

    @QueryProjection

    public CookingClassDto(String uuid, String title, String dishName, boolean isLimitedAge, String countryCode, Set<String> cookingClassTags, String description, String languageCode, int level, LocalDateTime cookingClassStartTime, LocalDateTime cookingClassEndTime, int dishCookingTime, Set<IngredientDto> ingredients, Set<RecipeDto> recipe, Set<String> cookingTools, int quota, LocalDateTime replayEndTime) {
        this.uuid = uuid;
        this.title = title;
        this.dishName = dishName;
        this.isLimitedAge = isLimitedAge;
        this.countryCode = countryCode;
        this.cookingClassTags = cookingClassTags;
        this.description = description;
        this.languageCode = languageCode;
        this.level = level;
        this.cookingClassStartTime = cookingClassStartTime;
        this.cookingClassEndTime = cookingClassEndTime;
        this.dishCookingTime = dishCookingTime;
        this.ingredients = ingredients;
        this.recipe = recipe;
        this.cookingTools = cookingTools;
        this.quota = quota;
        this.replayEndTime = replayEndTime;
    }
}
