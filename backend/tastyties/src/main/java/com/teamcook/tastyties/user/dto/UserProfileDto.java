package com.teamcook.tastyties.user.dto;

import com.teamcook.tastyties.common.dto.country.CountryResponseDto;
import com.teamcook.tastyties.common.dto.LanguageResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class UserProfileDto {
    private int userId;
    private String profileImageUrl;
    private String username;
    private String nickname;
    private String description;
    private CountryResponseDto country;
    private List<CountryResponseDto> collectedFlags;
    private LanguageResponseDto language;
    private String email;
    private LocalDate birth;
    private double activityPoint;

    //SNS
    private String instagramUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String youtubeHandle;
}
