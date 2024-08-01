package com.teamcook.tastyties.user.dto;

import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class UserInfoDto {
    private UserProfileDto userProfileDto;
    private Set<CookingClassListDto> hostingClasses;
}
