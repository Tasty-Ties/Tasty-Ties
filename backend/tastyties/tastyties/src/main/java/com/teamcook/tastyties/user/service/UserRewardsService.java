package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.country.CountryResponseDto;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.shared.entity.UserAndCountry;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.exception.CountryNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserRewardsService {

    private final CountryRepository countryRepository;
    private final UserAndCountryRepository userAndCountryRepository;

    public UserRewardsService(CountryRepository countryRepository, UserAndCountryRepository userAndCountryRepository) {
        this.countryRepository = countryRepository;
        this.userAndCountryRepository = userAndCountryRepository;
    }

    @Transactional
    public Map<String, Object> collectFlag(User user, String countryCode) {
        Map<String, Object> result = new HashMap<>();
        Country country = countryRepository.findByAlpha2(countryCode);
        if (country == null) {
            // countrynotfoundexception
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
}
