package com.b206.tastyties.user.service;

import com.b206.tastyties.user.dto.UserRegistrationDTO;
import com.b206.tastyties.user.entity.User;
import com.b206.tastyties.user.repository.UserRepository;
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

    public void registerUser(UserRegistrationDTO request) {
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(encodedPassword);
        newUser.setNickname(request.getNickname());
        newUser.setCountryCode(request.getCountryCode());
        newUser.setLanguageCode(request.getLanguageCode());

        newUser.setEmail(request.getEmailId() + "@" + request.getEmailDomain());
        newUser.setBirth(request.getBirth());

        userRepository.save(newUser);
    }
}
