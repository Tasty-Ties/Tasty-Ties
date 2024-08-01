package com.teamcook.tastytieschat.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class CommonResponseDTO {
    private int stateCode;
    private String message;
    private Object data;
}
