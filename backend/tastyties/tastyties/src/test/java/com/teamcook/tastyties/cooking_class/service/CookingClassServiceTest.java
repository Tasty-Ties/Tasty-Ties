package com.teamcook.tastyties.cooking_class.service;

import com.teamcook.tastyties.cooking_class.dto.CookingClassDto;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class CookingClassServiceTest {

    @Autowired
    CookingClassService service;

    // 본인 로컬 db에 들어있는 데이터로 테스트해야해요 ㅠㅠ
    @Test
    void 조회_테스트() {
        CookingClassDto classDetail = service.getCookingClassDetail(null, "195c9b9a-cf69-404a-96d8-19c528c6c2f6");
        assertThat(classDetail).isNotNull();
        assertThat(classDetail.getTitle()).isEqualTo("1000원의 행복2");
        assertThat(classDetail.getCookingClassTags()).containsExactly("간편한", "한끼", "저렴한");
    }
}