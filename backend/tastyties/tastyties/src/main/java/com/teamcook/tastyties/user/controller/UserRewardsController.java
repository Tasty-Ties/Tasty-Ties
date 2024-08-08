package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.dto.reward.CollectFlagDto;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.service.UserRewardsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// 국기 수집, 마일리지 등 부가기능을 담당하는 컨트롤러
@RestController
@RequestMapping("/users")
public class UserRewardsController {

    private final UserRewardsService userRewardsService;

    @Autowired
    public UserRewardsController(UserRewardsService userRewardsService) {
        this.userRewardsService = userRewardsService;
    }

    @PostMapping("/collect-flag")
    public ResponseEntity<CommonResponseDto> collectFlag(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                         @RequestBody CollectFlagDto request) {
        User user = userDetails.user();
        Map<String, Object> result = userRewardsService.collectFlag(user, request.getCountryCode());

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message(result.get("message").toString())
                        .data(result.get("country"))
                        .build());
    }
}
