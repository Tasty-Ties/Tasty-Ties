package com.teamcook.tastytieschat.chat.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class VoiceChatServiceImplTest {

    private final String TEST_FILE_PATH = "./a9a43000-ac59-499b-a6ef-11cfa0aa73ce.mp3";
    private final String TEST_TASK_KEY = "80c79ba2b16e4fbea3e9dc4cfe9b5fc1";

    @Autowired
    VoiceChatServiceImpl voiceChatService;

    @Test
    void sendFileToSpeechFlowTest() throws IOException {
        String taskId = voiceChatService.sendFileToSpeechFlow(TEST_FILE_PATH);
        System.out.println(taskId);
        Assertions.assertNotNull(taskId);
    }

    @Test
    void queryTranscriptionTest() throws IOException {
        String result = voiceChatService.queryTranscriptionResult(TEST_TASK_KEY);
        Assertions.assertNotNull(result);
    }


}