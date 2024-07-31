package com.teamcook.tastytieschat.translation.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GptRequestMessageDto {

    private String role;
    private String content;
    private float temperature;
}
