package com.teamcook.tastyties.cooking_class.entity;

import com.teamcook.tastyties.shared.entity.CookingClassAndCookingClassTag;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class CookingClassTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cookingClassTagId;

    private String cookingClassTagName;

    @OneToMany(mappedBy = "cookingClassTag")
    private List<CookingClassAndCookingClassTag> cookingClassAndCookingClassTags;
}
