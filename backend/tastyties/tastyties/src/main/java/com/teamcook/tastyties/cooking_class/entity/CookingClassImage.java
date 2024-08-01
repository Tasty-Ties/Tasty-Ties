package com.teamcook.tastyties.cooking_class.entity;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class CookingClassImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_id", referencedColumnName = "cookingClassId")
    private CookingClass cookingClass;

    private String cookingClassImageUrl;

    public CookingClassImage(CookingClass cookingClass, String cookingClassImageUrl) {
        this.cookingClass = cookingClass;
        this.cookingClassImageUrl = cookingClassImageUrl;
    }
}
