package com.teamcook.tastyties.cooking_class.entity;

import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class CookingClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cookingClassId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", referencedColumnName = "userId")
    private User host;

    // orphanremoval, cascade 관계 고려 필요
    @OneToMany(mappedBy = "cookingClass")
    private Set<UserAndCookingClass> userAndCookingClasses = new HashSet<>();

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
