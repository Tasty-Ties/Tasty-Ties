package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.service.uil.ClovaUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@SpringBootTest
public class ClovaUtilTest {

    private String fullData = "";
    private String SHORT_DECODE_FLEE_PATH = "./log/short_sentence.txt";
    private String LONG_DECODE_FLEE_PATH = "./log/long_sentence.txt";

    @Autowired
    ClovaUtil clovaUtil;
    @Autowired
    private VoiceChatServiceImpl voiceChatServiceImpl;

    @BeforeEach
    void setUp() {
        fullData = readLogData(LONG_DECODE_FLEE_PATH);
    }

    private String readLogData(String filePath) {
        StringBuilder content = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                content.append(line);
            }
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return content.toString();
    }

    @Test
    @DisplayName("파일 시스템에 쓰고 읽어와 STT")
    void translateVoiceToTextByFileSystemTest() throws IOException, InterruptedException {
        long startTime = System.currentTimeMillis();

        String filePath = voiceChatServiceImpl.saveAndGetFilePath(fullData);
        CompletableFuture<String> resultFuture = clovaUtil.translateVoiceToTextByFile(filePath);

        resultFuture.thenAccept(response -> {
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            System.out.println(response);
            System.out.println("translateVoiceToTextByFileSystemTest 소요시간: " + duration + " ms");
        });

        resultFuture.join();
    }

    @Test
    @DisplayName("디코딩된 문자열을 바로 바이트로 변환해 STT")
    void translateVoiceToTextByMemoryTest() throws IOException {
        long startTime = System.currentTimeMillis();

        byte[] wavBytes = voiceChatServiceImpl.getWavBytes(fullData);
        CompletableFuture<String> resultFuture = clovaUtil.translateVoiceToTextByByte(wavBytes);

        resultFuture.thenAccept(response -> {
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            System.out.println(response);
            System.out.println("translateVoiceToTextByFileMemoryTest 소요시간: " + duration + " ms");
        });

        resultFuture.join();
    }

    @Test
    @DisplayName("디코딩된 문자열을 레디스에서 바이트로 변환해 STT")
    void translateVoiceToTextByRedisTest() throws IOException {
        long startTime = System.currentTimeMillis();

        byte[] wavBytes = voiceChatServiceImpl.getWavBytesAtRedis(fullData);
        CompletableFuture<String> resultFuture = clovaUtil.translateVoiceToTextByByte(wavBytes);

        resultFuture.thenAccept(response -> {
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            System.out.println(response);
            System.out.println("translateVoiceToTextByFileMemoryTest 소요시간: " + duration + " ms");
        });

        resultFuture.join();
    }

}
