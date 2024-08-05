package com.teamcook.tastytieschat.chat.service.uil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.util.concurrent.CompletableFuture;

@Service
public class ClovaUtilByRestTemplate {

    @Value("${clova-client-id}")
    private String clovaClientId;

    @Value("${clova-client-secret}")
    private String clovaClientSecret;

    private final RestTemplate restTemplate;

    public ClovaUtilByRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CompletableFuture<String> translateVoiceToTextByFile(String filePath) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                File voiceFile = getFile(filePath);
                byte[] fileBytes = Files.readAllBytes(voiceFile.toPath());
                return translateVoiceToTextByByte(fileBytes).join();
            } catch (IOException e) {
                throw new RuntimeException("Error translating voice to text: " + e.getMessage(), e);
            }
        });
    }

    public CompletableFuture<String> translateVoiceToTextByByte(byte[] bytes) {
        return CompletableFuture.supplyAsync(() -> {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("X-NCP-APIGW-API-KEY-ID", clovaClientId);
            headers.set("X-NCP-APIGW-API-KEY", clovaClientSecret);

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(bytes, headers);

            String apiUrl = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor"; //TODO: lang 파라미터로 받아 넣기

            return restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class).getBody();
        });
    }

    private File getFile(String filePath) throws FileNotFoundException {
        File voiceFile = new File(filePath);
        if (!voiceFile.exists()) {
            throw new FileNotFoundException("File not found: " + filePath);
        }
        return voiceFile;
    }
}
