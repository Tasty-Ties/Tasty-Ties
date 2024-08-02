package com.teamcook.tastyties.cooking_class.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @NoArgsConstructor
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ingredientId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_id", referencedColumnName = "cookingClassId")
    private CookingClass cookingClass;

    private String ingredientName;
    private int quantity;
    private String quantityUnit;
    private boolean isRequired;

    public Ingredient(CookingClass cookingClass, String ingredientName, int quantity, String quantityUnit, boolean isRequired) {
        this.cookingClass = cookingClass;
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.quantityUnit = quantityUnit;
        this.isRequired = isRequired;
    }
}
