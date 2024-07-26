package com.teamcook.tastyties.cooking_class.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
public class CookingClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cookingClassId;

    private int userId;

    @NotNull
    private String languageCode;

    private String countryCode;

    private String title;
    private String description;
    private String dish_name;
    private int dishCookingTime;
    private int level;
    private int quota;
    private boolean isLimitedAge;

    private LocalDateTime cookingClassStartTime;
    private LocalDateTime cookingClassEndTime;

    private LocalDateTime replayEndTime;
    private LocalDateTime createTime = LocalDateTime.now();
    private LocalDateTime updateTime = LocalDateTime.now();

    private boolean isDelete = false;
}
