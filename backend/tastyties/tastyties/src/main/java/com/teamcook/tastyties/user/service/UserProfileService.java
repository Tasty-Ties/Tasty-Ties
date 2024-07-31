package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.CountryResponseDTO;
import com.teamcook.tastyties.common.dto.LanguageResponseDTO;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;
import com.teamcook.tastyties.shared.entity.UserAndCountry;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.dto.CollectFlagDto;
import com.teamcook.tastyties.user.dto.UserProfileDTO;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserAndCountryRepository userAndCountryRepository;

    @Autowired
    public UserProfileService(UserRepository userRepository, UserAndCountryRepository userAndCountryRepository) {
        this.userRepository = userRepository;
        this.userAndCountryRepository = userAndCountryRepository;
    }

    @Transactional
    public UserProfileDTO getMyProfile(Integer userId) {
        log.debug("query before");
        User user = userRepository.findUserWithCollectedFlags(userId);
        log.debug("query after");
        Country country = user.getCountry();
        Language language = user.getLanguage();

        List<CountryResponseDTO> collectedFlags = user.getUserAndCountries().stream()
                .map(uc -> new CountryResponseDTO(uc.getCountry().getAlpha2(),
                        uc.getCountry().getEnglishName(), uc.getCountry().getKoreanName()))
                .toList();

        return new UserProfileDTO(null, user.getNickname(),
                new CountryResponseDTO(country.getAlpha2(), country.getEnglishName(), country.getKoreanName()),
                collectedFlags,
                new LanguageResponseDTO(language.getAlpha2(), language.getEnglish(), language.getKorean()),
                user.getEmail(), user.getBirth(), 0,
                user.getInstagramUrl(), user.getInstagramHandle(),
                user.getYoutubeUrl(), user.getYoutubeHandle());
    }
}
