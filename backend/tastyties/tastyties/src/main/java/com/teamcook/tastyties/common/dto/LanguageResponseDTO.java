package com.teamcook.tastyties.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class LanguageResponseDTO {
    private String languageCode;
    private String englishName;
    private String koreanName;
}
