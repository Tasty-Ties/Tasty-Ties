package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.country.CountryResponseDto;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.shared.entity.UserAndCountry;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.exception.CountryNotFoundException;
import com.teamcook.tastyties.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class UserRewardsService {

    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final UserAndCountryRepository userAndCountryRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String WEEKLY_LEADERBOARD_KEY = "weekly:leaderboard";
    private static final String MONTHLY_LEADERBOARD_KEY = "monthly:leaderboard";
    private static final String YEARLY_LEADERBOARD_KEY = "yearly:leaderboard";

    @Autowired
    public UserRewardsService(UserRepository userRepository, CountryRepository countryRepository,
                              UserAndCountryRepository userAndCountryRepository,
                              RedisTemplate<String, Object> redisTemplate) {
        this.userRepository = userRepository;
        this.countryRepository = countryRepository;
        this.userAndCountryRepository = userAndCountryRepository;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public Map<String, Object> collectFlag(User user, String countryCode) {
        Map<String, Object> result = new HashMap<>();
        Country country = countryRepository.findByAlpha2(countryCode);
        if (country == null) {
            throw new CountryNotFoundException("지원하지 않는 국가입니다.");
        }
        boolean alreadyCollected = userAndCountryRepository.alreadyCollected(user, country);

        if (alreadyCollected) {
            result.put("message", "이미 수집한 국가의 국기입니다.");
        } else {
            assignFlagToUser(user, country);
            result.put("message", "새롭게 수집한 국가의 국기입니다.");
        }

        result.put("country", new CountryResponseDto(country.getAlpha2(), country.getEnglishName(),
                country.getKoreanName(), country.getCountryImageUrl()));
        return result;
    }

    private void assignFlagToUser(User user, Country country) {
        UserAndCountry userAndCountry = new UserAndCountry(user, country);
        userAndCountryRepository.save(userAndCountry);
    }

    // 이하로 마일리지, 랭킹 관리
    // 마일리지 부여
    @Transactional
    public void addScore(int userId, double score) {
        redisTemplate.opsForZSet().add(WEEKLY_LEADERBOARD_KEY, userId, score);
        redisTemplate.opsForZSet().add(MONTHLY_LEADERBOARD_KEY, userId, score);
        redisTemplate.opsForZSet().add(YEARLY_LEADERBOARD_KEY, userId, score);

        userRepository.findById(userId).ifPresent(user -> {
            user.setActivityPoint((int) (user.getActivityPoint() + score));
        });
    }

    // N명의 가장 높은 유저 반환
    @Transactional
    public Set<ZSetOperations.TypedTuple<Object>> getTopUsers(String period, int topN) {
        String key = getKeyByPeriod(period);
        return redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, topN - 1);
    }

    // 해당 유저의 점수 반환
    @Transactional
    public Double getUserScore(String period, int userId) {
        String key = getKeyByPeriod(period);
        return redisTemplate.opsForZSet().score(key, userId);
    }

    // 해당 유저의 순위 반환
    @Transactional
    public Long getUserRank(String period, int userId) {
        String key = getKeyByPeriod(period);
        return redisTemplate.opsForZSet().reverseRank(key, userId);
    }

    // 해당 유저의 점수 삭제
    @Transactional
    public void removeUser(String period, int userId) {
        String key = getKeyByPeriod(period);
        redisTemplate.opsForZSet().remove(key, userId);
    }

    // 설정한 기간에 따라 key 반환
    private static String getKeyByPeriod(String period) {
        String key;
        switch (period.toLowerCase()) {
            case "weekly":
                key = WEEKLY_LEADERBOARD_KEY;
                break;
            case "monthly":
                key = MONTHLY_LEADERBOARD_KEY;
                break;
            case "yearly":
                key = YEARLY_LEADERBOARD_KEY;
                break;
            default:
                throw new IllegalArgumentException("기간이 잘못되었습니다: " + period);
        }
        return key;
    }

}
