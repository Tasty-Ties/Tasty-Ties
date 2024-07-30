package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.dto.UserRegistrationDTO;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.exception.UserIDAlreadyExistsException;
import com.teamcook.tastyties.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CountryRepository countryRepository;
    private final UserAndCountryRepository userAndCountryRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       CountryRepository countryRepository, UserAndCountryRepository userAndCountryRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.countryRepository = countryRepository;
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
        newUser.setCountryCode(request.getCountryCode());
        newUser.setLanguageCode(request.getLanguageCode());

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

    public Country collectFlag(User user, String countryCode) {
        Country country = countryRepository.findByAlpha2(countryCode);
        if (country == null) {
            // countrynotfoundexception
        }
        boolean alreadyCollected = userAndCountryRepository.alreadyCollected(user, country);

        if (alreadyCollected) {
            return country;
        }
        return null;
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
