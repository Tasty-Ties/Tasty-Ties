package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.CountryResponseDto;
import com.teamcook.tastyties.common.dto.LanguageResponseDto;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.repository.CookingClassRepository;
import com.teamcook.tastyties.shared.dto.ReviewRequestDto;
import com.teamcook.tastyties.shared.dto.ReviewResponseDto;
import com.teamcook.tastyties.shared.repository.UserAndCookingClassRepository;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.dto.UserInfoDto;
import com.teamcook.tastyties.user.dto.UserProfileDto;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Slf4j
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserAndCountryRepository userAndCountryRepository;
    private final UserAndCookingClassRepository userAndClassRepository;
    private final CookingClassRepository cookingClassRepository;

    @Autowired
    public UserProfileService(UserRepository userRepository, UserAndCountryRepository userAndCountryRepository,
                              UserAndCookingClassRepository userAndClassRepository, CookingClassRepository cookingClassRepository) {
        this.userRepository = userRepository;
        this.userAndCountryRepository = userAndCountryRepository;
        this.userAndClassRepository = userAndClassRepository;
        this.cookingClassRepository = cookingClassRepository;
    }

    @Transactional
    public UserProfileDto getMyProfile(Integer userId) {
        log.debug("query before");
        User user = userRepository.findUserWithCollectedFlags(userId);
        log.debug("query after");
        return getUserProfileDto(user);
    }

    @Transactional
    public UserInfoDto getProfileMain(String username) {
        log.debug("username: {}", username);
        User user = userRepository.findUserWithCollectedFlags(username);
        if (user == null) {
            throw new UsernameNotFoundException("존재하지 않는 유저입니다.");
        }
        int userId = user.getUserId();
        log.debug("userId: {}", user.getUserId());
        UserProfileDto userProfileDto = getUserProfileDto(user);
        Set<CookingClassListDto> hostingClasses = cookingClassRepository.searchClassByHostIdForProfile(userId);
        Set<CookingClassListDto> reservedClasses = userAndClassRepository.findReservedClassesForProfile(userId);
        List<ReviewResponseDto> reviewList = userAndClassRepository.findReviewsForCookingClass(userId);
        return new UserInfoDto(userProfileDto, hostingClasses, reservedClasses, reviewList);
    }

    private static UserProfileDto getUserProfileDto(User user) {
        Country country = user.getCountry();
        Language language = user.getLanguage();

        List<CountryResponseDto> collectedFlags = user.getUserAndCountries().stream()
                .map(uc -> new CountryResponseDto(uc.getCountry().getAlpha2(),
                        uc.getCountry().getEnglishName(), uc.getCountry().getKoreanName()
                ,uc.getCountry().getCountryImageUrl()))
                .toList();

        return new UserProfileDto(user.getProfileImageUrl(), user.getNickname(),
                new CountryResponseDto(country.getAlpha2(), country.getEnglishName(),
                        country.getKoreanName(), country.getCountryImageUrl()),
                collectedFlags,
                new LanguageResponseDto(language.getAlpha2(), language.getEnglish(), language.getKorean()),
                user.getEmail(), user.getBirth(), 0,
                user.getInstagramUrl(), user.getInstagramHandle(),
                user.getYoutubeUrl(), user.getYoutubeHandle());
    }

    @Transactional
    public Page<CookingClassListDto> getReservedClasses(int userId, Pageable pageable) {
        return userAndClassRepository.findReservedClassesByUserId(userId, pageable);
    }

    @Transactional
    public Page<CookingClassListDto> getHostingClasses(int hostId, Pageable pageable) {
        return cookingClassRepository.searchClassByHostId(hostId, pageable);
    }
}
