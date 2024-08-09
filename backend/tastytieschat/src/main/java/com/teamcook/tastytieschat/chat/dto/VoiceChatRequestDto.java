package com.teamcook.tastytieschat.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class VoiceChatRequestDto {
    private String username;
    private String fileContent;
    private int chunkIndex;
    private int totalChunks;

    public void setUsername(String username) {
        this.username = username;
    }
}
