package com.teamcook.tastyties.common.dto.post;

import lombok.Data;

@Data
public class PostDto {
    private String title;
    private String content;

    public PostDto(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
