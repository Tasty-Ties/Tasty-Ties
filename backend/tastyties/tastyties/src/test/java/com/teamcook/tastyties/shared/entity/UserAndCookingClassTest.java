package com.teamcook.tastyties.shared.entity;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.cooking_class.repository.CookingClassRepository;
import com.teamcook.tastyties.shared.repository.UserAndCookingClassRepository;
import com.teamcook.tastyties.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserAndCookingClassTest {

    private static final Logger log = LoggerFactory.getLogger(UserAndCookingClassTest.class);
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CookingClassRepository cookingClassRepository;

    @Autowired
    private UserAndCookingClassRepository userAndCookingClassRepository;

    @Test
    @Transactional
    public void testUserAndCookingClassRelationship() {
        // 회원 생성
        userRepository.deleteByUsername("ssafy");

        User user = new User();
        user.setUsername("ssafy");
        user.setPassword("password");
        user.setNickname("김싸피");
        user.setCountry("KO");
        user.setLanguage("ko");
        user.setEmail("ssafy0718@gmail.com");
        user.setBirth(LocalDate.parse("2001-07-18"));
        User savedUser = userRepository.save(user);

        System.out.println(savedUser);

        // 쿠킹 클래스 생성
        // 쿠킹 클래스 생성
        CookingClass cookingClass = new CookingClass();
        cookingClass.setTitle("Korean Cooking 101");
        cookingClass.setDescription("Learn basic Korean dishes.");
        cookingClass.setDishName("Kimchi");
        cookingClass.setDishCookingTime(60);
        cookingClass.setHost(savedUser);  // 이 회원이 호스트
        cookingClass.setLanguageCode("ko"); // 여기서 languageCode 설정
        cookingClass.setHost(savedUser);
        CookingClass savedCookingClass = cookingClassRepository.save(cookingClass);
        // 관계 생성
        UserAndCookingClass userAndCookingClass = new UserAndCookingClass();
        userAndCookingClass.setUser(savedUser);
        userAndCookingClass.setCookingClass(savedCookingClass);
        userAndCookingClass.setCookingClassReview("Great class!");
        UserAndCookingClass savedUserAndCookingClass = userAndCookingClassRepository.save(userAndCookingClass);

        // 테스트: 저장된 데이터 확인
        Optional<UserAndCookingClass> foundUserAndCookingClass = userAndCookingClassRepository.findById(savedUserAndCookingClass.getUserCookingClassId());
        assertThat(foundUserAndCookingClass).isPresent();
        assertThat(foundUserAndCookingClass.get().getUser().getUsername()).isEqualTo("ssafy");
        assertThat(foundUserAndCookingClass.get().getCookingClass().getTitle()).isEqualTo("Korean Cooking 101");
        assertThat(foundUserAndCookingClass.get().getCookingClassReview()).isEqualTo("Great class!");
    }
}