package com.teamcook.tastyties.common.dto.country;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class CountryProfileDto {
    // 목록 조회 시 국가 정보를 넘기기 위한 DTO
    String alpha2;
    String countryImageUrl;

    @QueryProjection
    public CountryProfileDto(String alpha2, String countryImageUrl) {
        this.alpha2 = alpha2;
        this.countryImageUrl = countryImageUrl;
    }
}
