package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.CountryResponseDTO;
import com.teamcook.tastyties.common.dto.LanguageResponseDTO;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.shared.repository.UserAndCookingClassRepository;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.dto.UserProfileDTO;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserAndCountryRepository userAndCountryRepository;
    private final UserAndCookingClassRepository userAndClassRepository;

    @Autowired
    public UserProfileService(UserRepository userRepository, UserAndCountryRepository userAndCountryRepository,
                              UserAndCookingClassRepository userAndClassRepository) {
        this.userRepository = userRepository;
        this.userAndCountryRepository = userAndCountryRepository;
        this.userAndClassRepository = userAndClassRepository;
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

    @Transactional
    public Page<CookingClassListDto> getReservedClasses(int userId, Pageable pageable) {
        return userAndClassRepository.findReservedClassesByUserId(userId, pageable);
    }
}
