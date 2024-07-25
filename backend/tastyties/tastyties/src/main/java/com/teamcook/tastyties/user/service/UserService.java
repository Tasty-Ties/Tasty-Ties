package com.teamcook.tastyties.user.service;

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

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
}
