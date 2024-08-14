package com.teamcook.tastytieschat.chat.service.uil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@Service
public class ClovaUtilByWebClient {

    @Value("${clova-client-id}")
    private String clovaClientId;

    @Value("${clova-client-secret}")
    private String clovaClientSecret;

    private final WebClient webClient;

    public ClovaUtilByWebClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public CompletableFuture<String> translateVoiceToTextByFile(String filePath) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                File voiceFile = getFile(filePath);
                byte[] fileBytes = java.nio.file.Files.readAllBytes(voiceFile.toPath());
                return translateVoiceToTextByByte(fileBytes).join();
            } catch (IOException e) {
                throw new RuntimeException("Error translating voice to text: " + e.getMessage(), e);
            }
        });
    }

    public CompletableFuture<String> translateVoiceToTextByByte(byte[] bytes) {
        return webClient.post()
                .uri("/recog/v1/stt?lang=Kor")
                .header("Content-Type", "application/octet-stream")
                .bodyValue(bytes)
                .retrieve()
                .bodyToMono(String.class)
                .toFuture();
    }

    private File getFile(String filePath) throws FileNotFoundException {
        File voiceFile = new File(filePath);
        if (!voiceFile.exists()) {
            throw new FileNotFoundException("File not found: " + filePath);
        }
        return voiceFile;
    }
}