package com.teamcook.tastyties.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class CommonResponseDTO {
    private int stateCode;
    private String message;
    private Object data;
}
