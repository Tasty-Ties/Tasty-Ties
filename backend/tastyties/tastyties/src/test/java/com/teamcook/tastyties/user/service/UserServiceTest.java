package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.user.dto.UserRegistrationDTO;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void registerUser() {
        // Given: 새로운 사용자의 데이터
        UserRegistrationDTO newUser = new UserRegistrationDTO();
        newUser.setUsername("ssafy");
        newUser.setPassword("password");
        newUser.setNickname("김싸피");
        newUser.setCountryCode("KO");
        newUser.setLanguageCode("ko");
        newUser.setEmailId("ssafy0718");
        newUser.setEmailDomain("gmail.com");
        newUser.setBirth(LocalDate.parse("2001-07-18"));

        // When: 사용자 등록 메서드 호출
        String savedUser = userService.registerUser(newUser);
        // Then: 저장된 사용자 정보 확인
        assertThat(savedUser).isNotNull();
        assertThat(savedUser).isEqualTo(newUser.getUsername());
    }

    @Test
    void isUserNameAvailable() {

    }

    @Test
    void isNicknameAvailable() {
    }
}