package com.teamcook.tastyties.cooking_class.entity;

import com.teamcook.tastyties.shared.entity.CookingClassAndCookingClassTag;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
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

    @NotNull @Column(nullable = false)
    private String languageCode;
    @NotNull @Column(nullable = false)
    private String languageName;
    @NotNull @Column(nullable = false)
    private String countryCode;
    @NotNull @Column(nullable = false)
    private String countryName;

    @NotNull @Column(nullable = false)
    private String title;
    private String description;
    @NotNull @Column(nullable = false)
    private String dishName;
    @NotNull @Column(nullable = false)
    private int dishCookingTime;
    @NotNull @Column(nullable = false)
    private int level;
    @NotNull @Column(nullable = false)
    private int quota;
    @NotNull @Column(nullable = false)
    private boolean isLimitedAge;

    @NotNull @Column(nullable = false)
    private LocalDateTime cookingClassStartTime;
    @NotNull @Column(nullable = false)
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

    public void delete() {
        this.isDelete = true;
    }
}
