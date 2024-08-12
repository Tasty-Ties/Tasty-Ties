package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.dto.reward.ActivityPointRequestByUsernameDto;
import com.teamcook.tastyties.user.dto.reward.ActivityPointRequestDto;
import com.teamcook.tastyties.user.dto.reward.ActivityPointResponseDto;
import com.teamcook.tastyties.user.service.UserRewardsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/ranking")
@Slf4j
public class RankingController {

    private final UserRewardsService userRewardsService;

    @Autowired
    public RankingController(UserRewardsService userRewardsService) {
        this.userRewardsService = userRewardsService;
    }

    @PostMapping("/add")
    public ResponseEntity<CommonResponseDto> addScore(@RequestBody ActivityPointRequestDto activityPointRequestDto) {
        log.debug("test");
        userRewardsService.addScore(activityPointRequestDto);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("마일리지가 정상적으로 적립되었습니다.")
                        .data(null)
                        .build());
    }

    @PostMapping("/addByUsername")
    public ResponseEntity<CommonResponseDto> addScoreByUsername(@RequestBody ActivityPointRequestByUsernameDto activityPointRequestDto) {
        log.debug("test");
        userRewardsService.addScoreByUsername(activityPointRequestDto);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("마일리지가 정상적으로 적립되었습니다.")
                        .data(null)
                        .build());
    }

    @GetMapping("/weekly")
    public ResponseEntity<CommonResponseDto> getWeeklyLeaderboard(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                  @RequestParam int page) {
        ActivityPointResponseDto weeklyLeaderboard = userRewardsService.getWeeklyLeaderboard(userDetails, page);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("주간 랭킹을 정상적으로 조회했습니다.")
                        .data(weeklyLeaderboard)
                        .build());
    }

    @GetMapping("/monthly")
    public ResponseEntity<CommonResponseDto> getMonthlyLeaderboard(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                  @RequestParam int page) {
        ActivityPointResponseDto monthlyLeaderboard = userRewardsService.getMonthlyLeaderboard(userDetails, page);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("월간 랭킹을 정상적으로 조회했습니다.")
                        .data(monthlyLeaderboard)
                        .build());
    }

    @GetMapping("/yearly")
    public ResponseEntity<CommonResponseDto> getYearlyLeaderboard(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                  @RequestParam int page) {
        ActivityPointResponseDto yearlyLeaderboard = userRewardsService.getYearlyLeaderboard(userDetails, page);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("연간 랭킹을 정상적으로 조회했습니다.")
                        .data(yearlyLeaderboard)
                        .build());
    }

    @GetMapping("/total")
    public ResponseEntity<CommonResponseDto> getTotalLeaderboard(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                  @RequestParam int page) {
        ActivityPointResponseDto totalLeaderboard = userRewardsService.getTotalLeaderboard(userDetails, page);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("종합 랭킹을 정상적으로 조회했습니다.")
                        .data(totalLeaderboard)
                        .build());
    }

}
