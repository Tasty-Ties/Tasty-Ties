package com.teamcook.tastyties.cooking_class.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter @NoArgsConstructor
public class CookingTool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cookingToolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_id", referencedColumnName = "cookingClassId")
    private CookingClass cookingClass;

    private String cookingToolName;

    public CookingTool(CookingClass cookingClass, String cookingToolName) {
        this.cookingClass = cookingClass;
        this.cookingToolName = cookingToolName;
    }
}
