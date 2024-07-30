package com.teamcook.tastyties.user.dto;

import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;

import java.time.LocalDate;

public class UserProfileDTO {
    private String profileImageUrl;
    private String nickname;
    private Country country;
    private Language language;
    private String email;
    private LocalDate birth;
    private int activityPoint;
//    private List<CollectedCountry> collectedCountries;
}
