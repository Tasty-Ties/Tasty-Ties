package com.teamcook.tastyties.cooking_class.entity;

import com.teamcook.tastyties.shared.entity.CookingClassAndCookingClassTag;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@NoArgsConstructor
public class CookingClassTag {
    public CookingClassTag(String cookingClassTagName) {
        this.cookingClassTagName = cookingClassTagName;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cookingClassTagId;

    private String cookingClassTagName;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cookingClassTag")
    private List<CookingClassAndCookingClassTag> cookingClassAndCookingClassTags;
}
