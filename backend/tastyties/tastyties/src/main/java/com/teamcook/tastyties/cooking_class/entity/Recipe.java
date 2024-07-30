package com.teamcook.tastyties.cooking_class.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recipeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_id", referencedColumnName = "cookingClassId")
    private CookingClass cookingClass;

    private String step;
    private String description;
}
