package com.teamcook.tastyties.cooking_class.entity;

import com.teamcook.tastyties.shared.entity.CookingClassAndCookingClassTag;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter @Setter @AllArgsConstructor
@NoArgsConstructor
public class CookingClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cookingClassId;
    private String uuid;

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
    private String dishName;
    private int dishCookingTime;
    private int level;
    private int quota;
    private boolean isLimitedAge;

    private LocalDateTime cookingClassStartTime;
    private LocalDateTime cookingClassEndTime;

    private LocalDateTime replayEndTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    private boolean isDelete = false;

    @OneToMany(mappedBy = "cookingClass")
    private Set<Recipe> recipes = new HashSet<>();

    @OneToMany(mappedBy = "cookingClass")
    private Set<Ingredient> ingredients = new HashSet<>();

    @OneToMany(mappedBy = "cookingClass")
    private Set<CookingTool> cookingTools = new HashSet<>();

    @OneToMany(mappedBy = "cookingClass")
    private List<CookingClassAndCookingClassTag> cookingClassAndCookingClassTags;


    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
        uuid = UUID.randomUUID().toString();
    }

    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
}
