package com.teamcook.tastytieschat.chat.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class VoiceChatServiceImplTest {

    private final String TEST_FILE_PATH = "./01023a2f-80ff-4668-9d81-f0f10873af05.mp3";
    private String TEST_TASK_KEY = "e6cea46538f94f1983b27e1ad2511572";

    @Autowired
    VoiceChatServiceImpl voiceChatService;

    @Test
    void sendFileToSpeechFlowTest() throws IOException {
        String taskId = voiceChatService.sendFileToSpeechFlow(TEST_FILE_PATH);
        Assertions.assertNotNull(taskId);
        TEST_TASK_KEY = taskId;
    }

    @Test
    void queryTranscriptionTest() throws IOException {
        String result = voiceChatService.queryTranscriptionResult(TEST_TASK_KEY);
        Assertions.assertNotNull(result);
        System.out.println(result);
    }


}