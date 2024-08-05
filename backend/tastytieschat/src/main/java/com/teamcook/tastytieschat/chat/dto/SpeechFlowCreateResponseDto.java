package com.teamcook.tastytieschat.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpeechFlowCreateResponseDto {
    private int code;
    private String taskId;
    private String msg;
}
