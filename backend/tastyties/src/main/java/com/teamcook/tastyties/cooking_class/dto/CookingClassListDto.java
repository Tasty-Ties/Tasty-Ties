package com.teamcook.tastyties.cooking_class.dto;

import com.querydsl.core.annotations.QueryProjection;
import com.teamcook.tastyties.common.dto.country.CountryProfileDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CookingClassListDto {

    // 대표 이미지 추가 필요
    private String title;
    private String mainImage;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    // host의 username
    private String hostUsername;
    // host의 nickname
    private String hostName;
    private String uuid;
    private CountryProfileDto hostCountry;
    private CountryProfileDto classCountry;
    private boolean isLocal;
    private String chatRoomId;

    @QueryProjection
    public CookingClassListDto(String title, String mainImage,
                               LocalDateTime startTime, LocalDateTime endTime,
                               String hostUsername, String hostName, String uuid,
                               CountryProfileDto hostCountry, CountryProfileDto classCountry,
                               boolean isLocal, String chatRoomId) {
        this.title = title;
        this.mainImage = mainImage;
        this.startTime = startTime;
        this.endTime = endTime;
        this.hostUsername = hostUsername;
        this.hostName = hostName;
        this.uuid = uuid;
        this.hostCountry = hostCountry;
        this.classCountry = classCountry;
        this.isLocal = isLocal;
        this.chatRoomId = chatRoomId;
    }
}
