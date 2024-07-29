package com.teamcook.tastyties.cooking_class.dto;

import com.teamcook.tastyties.cooking_class.entity.Ingredient;
import com.teamcook.tastyties.cooking_class.entity.Recipe;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CookingClassRegisterDto {
    private String title;
    private String dishName;
    private boolean isLimitedAge;
    private String countryCode;
    private List<String> cookingClassTag;
    private String description;
    private String languageCode;
    private int level;
    private LocalDateTime cookingClassStartTime;
    private LocalDateTime cookingClassEndTime;
    private int dishCookingTime;
    private List<Ingredient> ingredients;
    private List<Recipe> recipe;
    private List<String> cookingTools;
    private int quota;
    private LocalDateTime replayEndTime;
    private boolean isDelete;
}
