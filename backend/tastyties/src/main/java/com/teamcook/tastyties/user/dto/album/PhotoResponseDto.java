package com.teamcook.tastyties.user.dto.album;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class PhotoResponseDto {
    private String photoImgUrl;
    private int photoId;

    @QueryProjection
    public PhotoResponseDto(String photoImgUrl, int photoId) {
        this.photoImgUrl = photoImgUrl;
        this.photoId = photoId;
    }
}
