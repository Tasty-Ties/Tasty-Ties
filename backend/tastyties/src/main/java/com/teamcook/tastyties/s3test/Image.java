package com.teamcook.tastyties.s3test;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Image {
    private String originName;
    private String storedImagePath;
}
