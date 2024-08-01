package com.teamcook.tastyties.cooking_class.dto;

import com.querydsl.core.annotations.QueryProjection;
import com.teamcook.tastyties.common.dto.CountryProfileDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CookingClassListDto {

    // 대표 이미지 추가 필요
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String hostName;
    private String uuid;
    private CountryProfileDto countryProfileDto;
    private boolean isLocal;

    @QueryProjection
    public CookingClassListDto(String title, LocalDateTime startTime, LocalDateTime endTime,
                               String hostName, String uuid, CountryProfileDto countryProfileDto,
                               boolean isLocal) {
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.hostName = hostName;
        this.uuid = uuid;
        this.countryProfileDto = countryProfileDto;
        this.isLocal = isLocal;
    }
}
