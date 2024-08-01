package com.teamcook.tastyties.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CountryResponseDto {
    private String countryCode;
    private String englishName;
    private String koreanName;
    private String countryImageUrl;
}
