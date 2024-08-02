package com.teamcook.tastytieschat.chat.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class VoiceChatServiceImplTest {

    private final String SHORT_FILE_PATH = "./static/short-sentence.mp3";
    private final String LONG_FILE_PATH = "./static/long-sentence.mp3";
    private String SHORT_TASK_KEY = "04fb5bdde7c44c86a0a3bf0c36a2b122";
    private String LONG_TASK_KEY = "323f43e0f5014085bc79c6aa476e071e";

    @Autowired
    VoiceChatServiceImpl voiceChatService;


    @Test
    @DisplayName("한 문장의 짧은 음성 파일을 서버에 보내고 키 받는 테스트")
    void sendShortFileToSpeechFlowTest() throws IOException {
        long startTime = System.currentTimeMillis();

        String taskId = voiceChatService.sendFileToSpeechFlow(SHORT_FILE_PATH);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("sendShortFileToSpeechFlowTest 소요시간: " + duration + " ms");

        System.out.println(taskId);
        Assertions.assertNotNull(taskId);
        SHORT_TASK_KEY = taskId;
    }

    @Test
    @DisplayName("짧은 문장을 쿼리하여, 변환된 텍스트를 불러오는 테스트")
    void queryShortFileTranscriptionTest() throws IOException, InterruptedException {
        long startTime = System.currentTimeMillis();

        String result = voiceChatService.queryTranscriptionResult(SHORT_TASK_KEY);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("queryShortFileTranscriptionTest 소요시간: " + duration + " ms");

        Assertions.assertNotNull(result);
    }

    @Test
    @DisplayName("한 문장의 긴 음성 파일을 서버에 보내고 키 받는 테스트")
    void sendLongFileToSpeechFlowTest() throws IOException {
        long startTime = System.currentTimeMillis();

        String taskId = voiceChatService.sendFileToSpeechFlow(LONG_FILE_PATH);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("sendLongFileToSpeechFlowTest 소요시간: " + duration + " ms");

        System.out.println(taskId);
        Assertions.assertNotNull(taskId);
        LONG_TASK_KEY = taskId;
    }

    @Test
    @DisplayName("긴 문장을 쿼리하여, 변환된 텍스트를 불러오는 테스트")
    void queryLongFileTranscriptionTest() throws IOException, InterruptedException {
        long startTime = System.currentTimeMillis();

        String result = voiceChatService.queryTranscriptionResult(LONG_TASK_KEY);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("queryLongFileTranscriptionTest 소요시간: " + duration + " ms");

        Assertions.assertNotNull(result);
    }

    @Test
    @DisplayName("짧은 문장, 네이버 클로바를 이용한 테스트")
    void translateShortVoiceToTextByClovaTest() throws IOException {
        long startTime = System.currentTimeMillis();

        String result = voiceChatService.translateVoiceToTextByClova(SHORT_FILE_PATH);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("translateShortVoiceToTextByClovaTest 소요시간: " + duration + " ms");

        System.out.println(result);
    }

    @Test
    @DisplayName("긴 문장, 네이버 클로바를 이용한 테스트")
    void translateLongVoiceToTextByClovaTest() throws IOException {
        long startTime = System.currentTimeMillis();
        String result = voiceChatService.translateVoiceToTextByClova(LONG_FILE_PATH);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("translateLongVoiceToTextByClovaTest 소요시간: " + duration + " ms");

        System.out.println(result);
    }

}