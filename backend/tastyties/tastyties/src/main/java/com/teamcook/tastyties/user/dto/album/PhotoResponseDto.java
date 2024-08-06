package com.teamcook.tastyties.user.dto.album;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class PhotoResponseDto {
    private String photoImgUrl;
    private int photoIndex;

    @QueryProjection
    public PhotoResponseDto(String photoImgUrl, int photoIndex) {
        this.photoImgUrl = photoImgUrl;
        this.photoIndex = photoIndex;
    }
}
