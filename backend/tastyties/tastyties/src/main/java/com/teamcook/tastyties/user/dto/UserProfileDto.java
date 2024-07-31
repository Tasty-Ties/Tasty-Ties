package com.teamcook.tastyties.user.dto;

import com.teamcook.tastyties.common.dto.CountryResponseDto;
import com.teamcook.tastyties.common.dto.LanguageResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class UserProfileDto {
    private String profileImageUrl;
    private String nickname;
    private CountryResponseDto country;
    private List<CountryResponseDto> collectedFlags;
    private LanguageResponseDto language;
    private String email;
    private LocalDate birth;
    private int activityPoint;

    //SNS
    private String instagramUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String youtubeHandle;
}
