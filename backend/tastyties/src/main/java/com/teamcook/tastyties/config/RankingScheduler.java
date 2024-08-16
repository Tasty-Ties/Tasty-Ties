package com.teamcook.tastyties.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RankingScheduler {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String WEEKLY_LEADERBOARD_KEY = "weekly:leaderboard";
    private static final String MONTHLY_LEADERBOARD_KEY = "monthly:leaderboard";
    private static final String YEARLY_LEADERBOARD_KEY = "yearly:leaderboard";

    @Autowired
    public RankingScheduler(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 매주 월요일 00:00에 실행
    @Scheduled(cron = "0 0 0 * * MON")
    public void resetWeeklyLeaderboard() {
        redisTemplate.delete(WEEKLY_LEADERBOARD_KEY);
    }

    // 매월 1일 00:00에 실행
    @Scheduled(cron = "0 0 0 1 * *")
    public void resetMonthlyLeaderboard() {
        redisTemplate.delete(MONTHLY_LEADERBOARD_KEY);
    }

    // 매년 1월 1일 00:00에 실행
    @Scheduled(cron = "0 0 0 1 1 *")
    public void resetYearlyLeaderboard() {
        redisTemplate.delete(YEARLY_LEADERBOARD_KEY);
    }
}
