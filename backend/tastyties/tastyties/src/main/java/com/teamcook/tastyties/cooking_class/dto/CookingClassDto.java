package com.teamcook.tastyties.cooking_class.dto;

import com.querydsl.core.annotations.QueryProjection;
import com.teamcook.tastyties.user.dto.UserProfileForClassDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CookingClassDto {
    private String uuid;
    private String hostName;
    private String title;
    private String dishName;
    private boolean isLimitedAge;
    private String countryCode;
    private String countryName;
    private Set<String> cookingClassTags;
    private String description;
    private String languageCode;
    private String languageName;
    private int level;
    private LocalDateTime cookingClassStartTime;
    private LocalDateTime cookingClassEndTime;
    private int dishCookingTime;
    private Set<IngredientDto> ingredients;
    private Set<RecipeDto> recipe;
    private Set<String> cookingTools;
    private int quota;
    private LocalDateTime replayEndTime;

    private boolean isUserEnrolled;
    private boolean isHost;

    private long reservedCount;

    private Set<UserProfileForClassDetailDTO> userProfiles;
}
