package com.teamcook.tastyties.shared.entity;

import com.teamcook.tastyties.shared.dto.ReviewRequestDto;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter @Setter
public class UserAndCookingClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userCookingClassId;

    private String uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_class_id", referencedColumnName = "cookingClassId")
    private CookingClass cookingClass;

    private String cookingClassReview;

    private LocalDateTime reservationTime;
    private LocalDateTime cookingClassReviewCreateTime;

    @PrePersist
    protected void onCreate() {
        uuid = UUID.randomUUID().toString();
        reservationTime = LocalDateTime.now();
    }

    // review 작성
    public void writeReview(ReviewRequestDto reviewRequestDto) {
        this.cookingClassReview = reviewRequestDto.getComment();
        this.cookingClassReviewCreateTime = LocalDateTime.now();
    }
}
