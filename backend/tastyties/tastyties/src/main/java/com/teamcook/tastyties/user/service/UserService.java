package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.CountryResponseDTO;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.common.repository.LanguageRepository;
import com.teamcook.tastyties.shared.entity.UserAndCountry;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.dto.UserRegistrationDTO;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.exception.CountryNotFoundException;
import com.teamcook.tastyties.user.exception.UserIDAlreadyExistsException;
import com.teamcook.tastyties.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;
    private final UserAndCountryRepository userAndCountryRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       CountryRepository countryRepository, LanguageRepository languageRepository,
                       UserAndCountryRepository userAndCountryRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.countryRepository = countryRepository;
        this.languageRepository = languageRepository;
        this.userAndCountryRepository = userAndCountryRepository;
    }

    public String registerUser(UserRegistrationDTO request) {
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserIDAlreadyExistsException("이미 존재하는 사용자 ID입니다");
        }
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(encodedPassword);
        newUser.setNickname(request.getNickname());
        newUser.setCountry(countryRepository.findByAlpha2(request.getCountryCode()));
        newUser.setLanguage(languageRepository.findByAlpha2(request.getLanguageCode()));

        newUser.setEmail(request.getEmailId() + "@" + request.getEmailDomain());
        newUser.setBirth(request.getBirth());

        User savedUser = userRepository.save(newUser);
        return savedUser.getUsername();
    }

    public boolean isUserNameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    public boolean isNicknameAvailable(String nickname) {
        return !userRepository.existsByNickname(nickname);
    }

    public boolean isEmailIdAvailable(String emailId, String emailDomain) {
        String email = emailId + "@" + emailDomain;
        return !userRepository.existsByEmail(email);
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

        result.put("country", new CountryResponseDTO(country.getAlpha2(), country.getEnglishName(),
                country.getKoreanName()));
        return result;
    }

    private void assignFlagToUser(User user, Country country) {
        UserAndCountry userAndCountry = new UserAndCountry(user, country);
        userAndCountryRepository.save(userAndCountry);
    }

    // user와 cookingclass 관계 생성
//    private void createUserAndCookingClassRelationship(User user, CookingClass cc) {
//        if (userAndCookingClassRepository.isUserEnrolledInClass(user, cc)) {
//            throw new IllegalArgumentException("이미 예약되어있습니다.");
//        }
//        UserAndCookingClass uAndc = new UserAndCookingClass();
//        uAndc.setUser(user);
//        uAndc.setCookingClass(cc);
//        uAndcRepository.save(uAndc);
//    }
}
