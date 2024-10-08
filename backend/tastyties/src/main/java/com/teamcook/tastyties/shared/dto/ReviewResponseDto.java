package com.teamcook.tastyties.shared.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponseDto {
    private String title;
    private String comment;
    private LocalDateTime cookingClassReviewCreateTime;
    private String mainImage;
    private String countryImageUrl;
    private String nickname;

    @QueryProjection
    public ReviewResponseDto(String title, String comment,
                             LocalDateTime cookingClassReviewCreateTime,
                             String mainImage, String countryImageUrl,
                             String nickname) {
        this.title = title;
        this.comment = comment;
        this.cookingClassReviewCreateTime = cookingClassReviewCreateTime;
        this.mainImage = mainImage;
        this.countryImageUrl = countryImageUrl;
        this.nickname = nickname;
    }
}
