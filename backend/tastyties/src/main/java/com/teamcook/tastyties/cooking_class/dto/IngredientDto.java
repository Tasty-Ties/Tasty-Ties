package com.teamcook.tastyties.cooking_class.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class IngredientDto {
    private String ingredientName;
    private int quantity;
    private String quantityUnit;
    private boolean isRequired;

    @QueryProjection
    public IngredientDto(String ingredientName, int quantity, String quantityUnit, boolean isRequired) {
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.quantityUnit = quantityUnit;
        this.isRequired = isRequired;
    }
}
