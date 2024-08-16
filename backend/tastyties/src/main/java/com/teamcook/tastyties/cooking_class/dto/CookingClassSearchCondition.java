package com.teamcook.tastyties.cooking_class.dto;

import lombok.Data;

@Data
public class CookingClassSearchCondition {
    private String title;
    private String nickname;
    private boolean useLocalFilter;
    private String sort;
    private String countryCode;
    private String languageCode;
}
