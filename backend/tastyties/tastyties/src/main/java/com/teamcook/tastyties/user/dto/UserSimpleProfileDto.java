package com.teamcook.tastyties.user.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

// 클래스 상세에서 조회가능한 유저의 정보를 나타내는 dto입니다.
@Data
public class UserSimpleProfileDto {
    private String profileImageUrl;
    private String nickname;
    private String username;

    @QueryProjection

    public UserSimpleProfileDto(String profileImageUrl, String nickname, String username) {
        this.profileImageUrl = profileImageUrl;
        this.nickname = nickname;
        this.username = username;
    }
}
