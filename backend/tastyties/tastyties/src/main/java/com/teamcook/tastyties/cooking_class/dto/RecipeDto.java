package com.teamcook.tastyties.cooking_class.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecipeDto {
    private String step;
    private String description;
}
