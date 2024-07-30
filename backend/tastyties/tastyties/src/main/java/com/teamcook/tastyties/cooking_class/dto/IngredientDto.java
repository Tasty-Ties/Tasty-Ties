package com.teamcook.tastyties.cooking_class.dto;

import lombok.Data;

@Data
public class IngredientDto {
    private String ingredientName;
    private int quantity;
    private String quantityUnit;
    private boolean isRequired;
}
