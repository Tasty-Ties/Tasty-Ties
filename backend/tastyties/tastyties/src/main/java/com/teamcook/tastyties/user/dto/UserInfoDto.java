package com.teamcook.tastyties.user.dto;

import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.shared.dto.ReviewResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Set;

// 남에게 보이는 프로필 조회를 위한 DTO입니다.
@Data
@AllArgsConstructor
public class UserInfoDto {
    private UserProfileDto userProfileDto;
    private Set<CookingClassListDto> hostingClasses;
    private Set<CookingClassListDto> reservedClasses;
    private List<ReviewResponseDto> reviews;
}
