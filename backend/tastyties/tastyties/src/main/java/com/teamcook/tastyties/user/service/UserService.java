package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.CountryResponseDTO;
import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.common.repository.LanguageRepository;
import com.teamcook.tastyties.shared.entity.UserAndCountry;
import com.teamcook.tastyties.shared.repository.UserAndCookingClassRepository;
import com.teamcook.tastyties.shared.repository.UserAndCountryRepository;
import com.teamcook.tastyties.user.dto.UserRegistrationDTO;
import com.teamcook.tastyties.user.dto.UserUpdateDTO;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.exception.CountryNotFoundException;
import com.teamcook.tastyties.user.exception.UserIDAlreadyExistsException;
import com.teamcook.tastyties.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;
    private final UserAndCountryRepository userAndCountryRepository;
    private final UserAndCookingClassRepository userAndCookingClassRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       CountryRepository countryRepository, LanguageRepository languageRepository,
                       UserAndCountryRepository userAndCountryRepository, UserAndCookingClassRepository userAndCookingClassRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.countryRepository = countryRepository;
        this.languageRepository = languageRepository;
        this.userAndCountryRepository = userAndCountryRepository;
        this.userAndCookingClassRepository = userAndCookingClassRepository;
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

    public UserUpdateDTO updateProfile(UserDetails userDetails, UserUpdateDTO request) {
        Optional<User> findUser = userRepository.findByUsername(userDetails.getUsername());
        if (findUser.isEmpty()) {
            throw new IllegalArgumentException("유저의 정보를 찾을 수 없습니다.");
        }
        User user = findUser.get();

        // URL에서 핸들 추출
        String instagramHandle = extractInstagramHandle(request.getInstagramUrl());
        String youtubeHandle = extractYoutubeHandle(request.getYoutubeUrl());

        user.updateUser(request, passwordEncoder.encode(request.getPassword()),
                instagramHandle, youtubeHandle);
        userRepository.save(user);
        return request;
    }

    private String extractInstagramHandle(String url) {
        if (url == null || url.isEmpty()) return null;
        if (url.endsWith("/")) url = url.substring(0, url.length() - 1);
        return url.substring(url.lastIndexOf("/") + 1);
    }

    private String extractYoutubeHandle(String url) {
        if (url == null || url.isEmpty()) return null;
        int atIndex = url.lastIndexOf("@");
        if (atIndex != -1) {
            return url.substring(atIndex + 1);
        }
        return null;
    }

    @Transactional
    public void deleteProfile(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("잘못된 요청입니다.");
        }
        User user = optionalUser.get();
        user.delete();
        userRepository.save(user);
        userAndCookingClassRepository.deleteAllByUser(user);
    }
}
