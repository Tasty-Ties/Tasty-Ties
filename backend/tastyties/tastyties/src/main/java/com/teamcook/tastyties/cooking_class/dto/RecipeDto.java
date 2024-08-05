package com.teamcook.tastyties.cooking_class.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class RecipeDto {
    private String step;
    private String description;

    @QueryProjection
    public RecipeDto(String step, String description) {
        this.step = step;
        this.description = description;
    }
}
