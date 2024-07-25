package com.teamcook.tastyties.user.repository;

import com.teamcook.tastyties.user.dto.UserRegistrationDTO;
import com.teamcook.tastyties.user.entity.User;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveAndFindById() {
        // 더미 데이터 생성
        User newUser = new User();
        newUser.setUsername("ssafy");
        newUser.setPassword("password");
        newUser.setNickname("김싸피");
        newUser.setCountryCode("KO");
        newUser.setLanguageCode("ko");
        newUser.setEmail("ssafy0718@gmail.com");
        newUser.setBirth(LocalDate.parse("2001-07-18"));

        // 데이터 저장
        User savedUser = userRepository.save(newUser);

        // 데이터 검색 및 검증
        User foundUser = userRepository.findById(savedUser.getUserId()).orElse(null);
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getUsername()).isEqualTo("ssafy");
    }
}