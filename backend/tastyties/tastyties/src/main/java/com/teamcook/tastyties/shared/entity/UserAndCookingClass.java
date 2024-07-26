package com.teamcook.tastyties.shared.entity;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class UserAndCookingClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userCookingClassId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_id", referencedColumnName = "cookingClassId")
    private CookingClass cookingClass;

    private String cookingClassReview;
    private LocalDateTime cookingClassReviewCreateTime = LocalDateTime.now();
}
