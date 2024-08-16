package com.teamcook.tastyties.common.dto.country;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class CountrySearchDto {
    private String alpha2;
    private String koreanName;

    @QueryProjection
    public CountrySearchDto(String alpha2, String koreanName) {
        this.alpha2 = alpha2;
        this.koreanName = koreanName;
    }
}
