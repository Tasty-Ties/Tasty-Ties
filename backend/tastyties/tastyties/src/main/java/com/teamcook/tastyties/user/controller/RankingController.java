package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.user.service.UserRewardsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/ranking")
public class RankingController {

    private final UserRewardsService userRewardsService;

    @Autowired
    public RankingController(UserRewardsService userRewardsService) {
        this.userRewardsService = userRewardsService;
    }

    @PostMapping("/add")
    public void addScore(@RequestParam int userId, @RequestParam double score) {
        userRewardsService.addScore(userId, score);
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
