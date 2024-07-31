package com.teamcook.tastyties.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
@Builder
public class CommonResponseDto {
    private int stateCode;
    private String message;
    private Object data;
}
