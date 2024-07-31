package com.teamcook.tastyties.user.dto;

import com.teamcook.tastyties.common.dto.CountryResponseDTO;
import com.teamcook.tastyties.common.dto.LanguageResponseDTO;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class UserProfileDTO {
    private String profileImageUrl;
    private String nickname;
    private CountryResponseDTO country;
    private List<CountryResponseDTO> collectedFlags;
    private LanguageResponseDTO language;
    private String email;
    private LocalDate birth;
    private int activityPoint;

    //SNS
    private String instagramUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String youtubeHandle;
}
