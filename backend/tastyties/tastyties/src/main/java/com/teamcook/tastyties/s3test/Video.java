package com.teamcook.tastyties.s3test;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Video {
    private String originName;
    private String storedVideoPath;
}
