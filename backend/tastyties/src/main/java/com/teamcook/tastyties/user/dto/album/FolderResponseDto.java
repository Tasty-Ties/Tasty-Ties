package com.teamcook.tastyties.user.dto.album;

import com.querydsl.core.annotations.QueryProjection;
import com.teamcook.tastyties.common.dto.country.CountrySearchDto;
import com.teamcook.tastyties.user.dto.UserSimpleProfileDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
public class FolderResponseDto {
    private String title;
    private List<PhotoResponseDto> photoResponse = new ArrayList<>();
    private UserSimpleProfileDto host;
    private LocalDateTime cookingClassStartTime;
    private LocalDateTime cookingClassEndTime;
    private Set<UserSimpleProfileDto> userProfiles;

    @QueryProjection
    public FolderResponseDto(String title, UserSimpleProfileDto host,
                             LocalDateTime cookingClassStartTime,
                             LocalDateTime cookingClassEndTime) {
        this.title = title;
        this.host = host;
        this.cookingClassStartTime = cookingClassStartTime;
        this.cookingClassEndTime = cookingClassEndTime;
    }
}
