package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.service.uil.ClovaUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
public class ClovaUtilTest {

    private final String SHORT_FILE_PATH = "./static/short-sentence.mp3";
    private final String LONG_FILE_PATH = "./static/long-sentence.mp3";

    @Autowired
    ClovaUtil clovaUtil;

    @Test
    @DisplayName("짧은 문장, 네이버 클로바를 이용한 테스트")
    void translateShortVoiceToTextByClovaTest() throws IOException {
        long startTime = System.currentTimeMillis();

        String result = clovaUtil.translateVoiceToTextByFile(SHORT_FILE_PATH);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("translateShortVoiceToTextByClovaTest 소요시간: " + duration + " ms");

        System.out.println(result);
    }

    @Test
    @DisplayName("긴 문장, 네이버 클로바를 이용한 테스트")
    void translateLongVoiceToTextByClovaTest() throws IOException {
        long startTime = System.currentTimeMillis();
        String result = clovaUtil.translateVoiceToTextByFile(LONG_FILE_PATH);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("translateLongVoiceToTextByClovaTest 소요시간: " + duration + " ms");

        System.out.println(result);
    }
}
