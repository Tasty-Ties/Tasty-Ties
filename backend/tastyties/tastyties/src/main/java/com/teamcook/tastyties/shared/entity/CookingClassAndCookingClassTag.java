package com.teamcook.tastyties.shared.entity;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CookingClassAndCookingClassTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cookingClassAndCookingClassTagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_id", referencedColumnName = "cookingClassId")
    private CookingClass cookingClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_tag_id", referencedColumnName = "cookingClassTagId")
    private CookingClassTag cookingClassTag;
}
