package com.teamcook.tastytieschat.chat.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class VoiceChatServiceImplTest {

    @Autowired
    VoiceChatServiceImpl voiceChatService;

    private String fullData = "";

    @Test
    void translateVoiceToTextByFileSystem() throws IOException, InterruptedException {
        String result = String.valueOf(voiceChatService.translateVoiceToTextByFileSystem(fullData));
        System.out.println(result);
    }

    @Test
    void translateVoiceToTextByMemory() throws IOException, InterruptedException {
        String result = String.valueOf(voiceChatService.translateVoiceToTextByFileSystem(fullData));
        System.out.println(result);
    }
}