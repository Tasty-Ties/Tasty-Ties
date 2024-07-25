package com.b206.tastyties.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class LanguageCodeResponseDTO {
    private String languageCode;
    private String languageName;
}
