package com.teamcook.tastytieschat.translation.dto;

import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GptRequestDto {

    private String model;
    private List<GptRequestMessageDto> messages;

}
