package com.teamcook.tastyties.cooking_class.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IngredientDto {
    private String ingredientName;
    private int quantity;
    private String quantityUnit;
    private boolean isRequired;
}
