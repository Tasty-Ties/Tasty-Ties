package com.teamcook.tastyties.user.dto.album;

import lombok.Data;

@Data
public class PhotoOrderChangeDto {
    private int photoId;
    private int orderIndex;
}
