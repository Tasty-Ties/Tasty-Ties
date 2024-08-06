package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.user.service.UserRewardsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<CommonResponseDto> addScore(@RequestParam int userId, @RequestParam double score) {
        log.debug("test");
        userRewardsService.addScore(userId, score);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("마일리지가 정상적으로 적립되었습니다.")
                        .data(null)
                        .build());
    }

//    @GetMapping("/top")
//    public Set<ZSetOperations.TypedTuple<Object>> getTopUsers(@RequestParam int topN) {
//        return userRewardsService.getTopUsers(topN);
//    }
//
//    @GetMapping("/score")
//    public Double getUserScore(@RequestParam String userId) {
//        return userRewardsService.getUserScore(userId);
//    }
//
//    @GetMapping("/rank")
//    public Long getUserRank(@RequestParam String userId) {
//        return userRewardsService.getUserRank(userId);
//    }
//
//    @DeleteMapping("/remove")
//    public void removeUser(@RequestParam String userId) {
//        userRewardsService.removeUser(userId);
//    }
}
