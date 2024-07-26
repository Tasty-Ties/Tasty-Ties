package com.teamcook.tastyties.cooking_class.entity;

import jakarta.persistence.*;

@Entity
public class CookingTool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cookingToolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_id", referencedColumnName = "cookingClassId")
    private CookingClass cookingClass;

    private String cookingToolName;
}
