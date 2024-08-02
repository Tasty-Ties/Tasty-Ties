package com.teamcook.tastytieschat.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class VoiceChatRequestDto {
    private int userId;
    private String fileContent;
    private int chunkIndex;
    private int totalChunks;
}
