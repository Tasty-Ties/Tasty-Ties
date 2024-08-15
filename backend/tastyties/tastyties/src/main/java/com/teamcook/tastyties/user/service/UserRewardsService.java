package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.country.CountryResponseDto;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.shared.entity.UserAndCountry;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.dto.reward.*;
import com.teamcook.tastyties.user.entity.ActivityPointLog;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.entity.UserStatistics;
import com.teamcook.tastyties.user.exception.CountryNotFoundException;
import com.teamcook.tastyties.user.repository.UserRepository;
import com.teamcook.tastyties.user.repository.activitypoint.ActivityPointLogRepository;
import com.teamcook.tastyties.user.repository.statistics.UserStatisticsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
public class UserRewardsService {

    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final UserAndCountryRepository userAndCountryRepository;
    private final ActivityPointLogRepository activityPointLogRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String WEEKLY_LEADERBOARD_KEY = "weekly:leaderboard";
    private static final String MONTHLY_LEADERBOARD_KEY = "monthly:leaderboard";
    private static final String YEARLY_LEADERBOARD_KEY = "yearly:leaderboard";
    private static final int PAGE_SIZE = 7;
    private final UserStatisticsRepository userStatisticsRepository;

    @Autowired
    public UserRewardsService(UserRepository userRepository, CountryRepository countryRepository,
                              UserAndCountryRepository userAndCountryRepository, ActivityPointLogRepository activityPointLogRepository,
                              RedisTemplate<String, Object> redisTemplate, UserStatisticsRepository userStatisticsRepository) {
        this.userRepository = userRepository;
        this.countryRepository = countryRepository;
        this.userAndCountryRepository = userAndCountryRepository;
        this.activityPointLogRepository = activityPointLogRepository;
        this.redisTemplate = redisTemplate;
        this.userStatisticsRepository = userStatisticsRepository;
    }

    // 국기 수집 기능
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
    public void addScore(ActivityPointRequestDto activityPointRequestDto) {
        int userId = activityPointRequestDto.getUserId();
        double score = activityPointRequestDto.getScore();
        String description = activityPointRequestDto.getDescription();
        String userKey = String.valueOf(userId);

        // 기존 점수를 가져와서 누적
        Double currentWeeklyScore = redisTemplate.opsForZSet().score(WEEKLY_LEADERBOARD_KEY, userKey);
        Double currentMonthlyScore = redisTemplate.opsForZSet().score(MONTHLY_LEADERBOARD_KEY, userKey);
        Double currentYearlyScore = redisTemplate.opsForZSet().score(YEARLY_LEADERBOARD_KEY, userKey);

        double newWeeklyScore = (currentWeeklyScore != null ? currentWeeklyScore : 0) + score;
        double newMonthlyScore = (currentMonthlyScore != null ? currentMonthlyScore : 0) + score;
        double newYearlyScore = (currentYearlyScore != null ? currentYearlyScore : 0) + score;

        redisTemplate.opsForZSet().add(WEEKLY_LEADERBOARD_KEY, userKey, newWeeklyScore);
        redisTemplate.opsForZSet().add(MONTHLY_LEADERBOARD_KEY, userKey, newMonthlyScore);
        redisTemplate.opsForZSet().add(YEARLY_LEADERBOARD_KEY, userKey, newYearlyScore);
        userRepository.findById(userId).ifPresent(user -> {
            ActivityPointLog log = new ActivityPointLog(score, user.getActivityPoint() + score, description);
            activityPointLogRepository.save(log);
            user.addActivityPointLog(log);
        });
    }

    @Transactional
    public void addScoreAfterClass(ActivityPointAfterClassRequestDto afterClassRequestDto) {
        ActivityPointRequestDto activityPointRequestDto = afterClassRequestDto.getActivityPointRequestDto();
        addScore(activityPointRequestDto);
        int userId = activityPointRequestDto.getUserId();
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("user를 찾을 수 없습니다.");
        }

        UserStatistics userStatistics = userStatisticsRepository.getUserStatistics(user);
        userStatistics.updateStatistics(afterClassRequestDto.isHost());
    }

    @Transactional
    public void addScoreByUsername(ActivityPointRequestByUsernameDto activityPointRequestDto) {
        User findUser = userRepository.findByUsername(activityPointRequestDto.getUsername()).orElse(null);
        int userId = findUser.getUserId();
        double score = activityPointRequestDto.getScore();
        String description = activityPointRequestDto.getDescription();
        String userKey = String.valueOf(userId);

        // 기존 점수를 가져와서 누적
        Double currentWeeklyScore = redisTemplate.opsForZSet().score(WEEKLY_LEADERBOARD_KEY, userKey);
        Double currentMonthlyScore = redisTemplate.opsForZSet().score(MONTHLY_LEADERBOARD_KEY, userKey);
        Double currentYearlyScore = redisTemplate.opsForZSet().score(YEARLY_LEADERBOARD_KEY, userKey);

        double newWeeklyScore = (currentWeeklyScore != null ? currentWeeklyScore : 0) + score;
        double newMonthlyScore = (currentMonthlyScore != null ? currentMonthlyScore : 0) + score;
        double newYearlyScore = (currentYearlyScore != null ? currentYearlyScore : 0) + score;

        redisTemplate.opsForZSet().add(WEEKLY_LEADERBOARD_KEY, userKey, newWeeklyScore);
        redisTemplate.opsForZSet().add(MONTHLY_LEADERBOARD_KEY, userKey, newMonthlyScore);
        redisTemplate.opsForZSet().add(YEARLY_LEADERBOARD_KEY, userKey, newYearlyScore);
        userRepository.findById(userId).ifPresent(user -> {
            ActivityPointLog log = new ActivityPointLog(score, user.getActivityPoint()+score, description);
            activityPointLogRepository.save(log);
            user.addActivityPointLog(log);
        });
    }

    // 순위 반환
    public ActivityPointResponseDto getLeaderboard(CustomUserDetails userDetails, String leaderboardKey, int page) {
        int start = (page-1)*PAGE_SIZE;
        int end = start + PAGE_SIZE - 1;

        // 전체 ZSet 크기 가져오기
        Long totalSize = redisTemplate.opsForZSet().zCard(leaderboardKey);
        int totalPages = (int) Math.ceil((double) totalSize / PAGE_SIZE);
        Set<ZSetOperations.TypedTuple<Object>> results = redisTemplate.opsForZSet()
                .reverseRangeWithScores(leaderboardKey, start, end);
        List<RankedUserDto> rankedUsers = new ArrayList<>();
        if (results == null || results.isEmpty()) {
            // 결과가 없으면 빈 리스트와 총 페이지 수를 반환
            return new ActivityPointResponseDto(rankedUsers, null, totalPages);
        }

        int rank = start + 1;
        for (ZSetOperations.TypedTuple<Object> result : results) {
            int userId = Integer.parseInt((String) result.getValue());
            double score = result.getScore();
            User user = userRepository.findById(userId).orElseThrow();
            log.debug("userId for test: {}", user.getUserId());
            if (!user.isDeleted()) {
                UserStatistics userStatistics = user.getUserStatistics();
                rankedUsers.add(new RankedUserDto(userId, user.getUsername(), user.getNickname(), score, rank,
                        userStatistics.getClassesHosted(), userStatistics.getClassesAttended(),
                        user.getProfileImageUrl(), user.getDescription()));
                rank++;
            }
        }


        // 여기 부터 나의 랭크 찾기
        RankedUserDto myRank = null;
        if (userDetails != null) {
            User user = userDetails.user();
            UserStatistics userStatistics = user.getUserStatistics();

            int userId = user.getUserId();
            String userKey = String.valueOf(userId);
            myRank = new RankedUserDto(userId, user.getUsername(), user.getNickname(),
                    getUserScore(leaderboardKey, userKey),
                    getUserRank(leaderboardKey, userKey),
                    userStatistics.getClassesHosted(), userStatistics.getClassesAttended(),
                    user.getProfileImageUrl(), user.getDescription());
        }
        return new ActivityPointResponseDto(rankedUsers, myRank, totalPages);
    }

    @Transactional
    public ActivityPointResponseDto getWeeklyLeaderboard(CustomUserDetails userDetails, int page) {
        return getLeaderboard(userDetails, WEEKLY_LEADERBOARD_KEY, page);
    }

    @Transactional
    public ActivityPointResponseDto getMonthlyLeaderboard(CustomUserDetails userDetails, int page) {
        return getLeaderboard(userDetails, MONTHLY_LEADERBOARD_KEY, page);
    }

    @Transactional
    public ActivityPointResponseDto getYearlyLeaderboard(CustomUserDetails userDetails, int page) {
        return getLeaderboard(userDetails, YEARLY_LEADERBOARD_KEY, page);
    }

    // 해당 유저의 점수 반환
    public Double getUserScore(String leaderBoardKey, String userId) {
        Double score = redisTemplate.opsForZSet().score(leaderBoardKey, userId);
        return score != null ? score : 0.0;
    }

    public int getUserRank(String leaderBoardKey, String userId) {
        Long rank = redisTemplate.opsForZSet().reverseRank(leaderBoardKey, userId);
        return rank != null ? rank.intValue() + 1 : 0;
    }

    @Transactional
    public ActivityPointResponseDto getTotalLeaderboard(CustomUserDetails userDetails, int page) {
        Pageable pageable = PageRequest.of(page - 1, PAGE_SIZE, Sort.by(Sort.Direction.DESC, "activityPoint"));
        List<User> users = userRepository.findAll(pageable).getContent();

        long count = userRepository.count()-1;
        int totalPages = (int) Math.ceil((double) count / PAGE_SIZE);

        List<RankedUserDto> rankedUsers = new ArrayList<>();
        int rank = (page - 1) * PAGE_SIZE + 1;
        for (User user : users) {
            if (user.getUserId() == 1) {
                continue;
            }
            if (!user.isDeleted()) {
                UserStatistics userStatistics = user.getUserStatistics();
                rankedUsers.add(new RankedUserDto(user.getUserId(), user.getUsername(), user.getNickname(), user.getActivityPoint(), rank,
                        userStatistics.getClassesHosted(), userStatistics.getClassesAttended(),
                        user.getProfileImageUrl(), user.getDescription()));
                rank++;
            }
        }

        RankedUserDto myRank = null;
        if (userDetails != null) {
            User user = userDetails.user();
            UserStatistics userStatistics = user.getUserStatistics();
            myRank = new RankedUserDto(user.getUserId(), user.getUsername(), user.getNickname(), user.getActivityPoint(),
                    getUserRankByActivityPoint(user), userStatistics.getClassesHosted(),
                    userStatistics.getClassesAttended(), user.getProfileImageUrl(), user.getDescription());
        }
        return new ActivityPointResponseDto(rankedUsers, myRank, totalPages);
    }

    private int getUserRankByActivityPoint(User user) {
        long rank = userRepository.countByActivityPointGreaterThan(user.getActivityPoint());
        return (int) rank + 1;
    }

    public List<ActivityPointLogResponseDto> getMyActivityPointLog(CustomUserDetails userDetails, int period) {
        User user = userDetails.user();
        return activityPointLogRepository.findActivityPointLogForProfile(user, period);
    }
}
