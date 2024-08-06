package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.common.repository.LanguageRepository;
import com.teamcook.tastyties.s3test.Image;
import com.teamcook.tastyties.s3test.S3Service;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.shared.repository.UserAndCookingClassRepository;
import com.teamcook.tastyties.user.dto.AuthRequestDto;
import com.teamcook.tastyties.user.dto.UserRegistrationDto;
import com.teamcook.tastyties.user.dto.UserUpdateDto;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.exception.UserIDAlreadyExistsException;
import com.teamcook.tastyties.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;
    private final UserAndCookingClassRepository userAndCookingClassRepository;
    private final S3Service s3Service;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       CountryRepository countryRepository, LanguageRepository languageRepository,
                       UserAndCookingClassRepository userAndCookingClassRepository,
                       @Qualifier("Local") S3Service s3Service) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.countryRepository = countryRepository;
        this.languageRepository = languageRepository;
        this.userAndCookingClassRepository = userAndCookingClassRepository;
        this.s3Service = s3Service;
    }

    public String registerUser(UserRegistrationDto request) {
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

        // 기본 앨범 생성 및 사용자에 추가
        Album defaultAlbum = new Album("나의 앨범");
        newUser.addAlbum(defaultAlbum);

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

    public void updateFCMToken(AuthRequestDto authRequest) {
        Optional<User> findUser = userRepository.findByUsername(authRequest.getUsername());
        if (findUser.isEmpty()) {
            throw new IllegalArgumentException("유저의 정보를 찾을 수 없습니다.");
        }
        User user = findUser.get();

        user.setFcmToken(authRequest.getFcmToken());

        userRepository.save(user);
    }

    public UserUpdateDto updateProfile(UserDetails userDetails, UserUpdateDto request) {
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

    @Transactional
    public String uploadImage(CustomUserDetails userDetails, MultipartFile file) {
        User user = userDetails.user();
        try {
            Image image = s3Service.uploadImage(file);
            user.setProfileImageUrl(image.getStoredImagePath());
            userRepository.save(user);
            return user.getProfileImageUrl();
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 중 문제가 생겼습니다.");
        }
    }
}
