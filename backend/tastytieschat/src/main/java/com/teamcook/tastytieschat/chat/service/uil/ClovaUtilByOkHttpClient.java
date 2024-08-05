package com.teamcook.tastytieschat.chat.service.uil;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
public class ClovaUtilByOkHttpClient {

    @Value("${clova-client-id}")
    private String clovaClientId;

    @Value("${clova-client-secret}")
    private String clovaClientSecret;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .protocols(java.util.Arrays.asList(Protocol.HTTP_1_1, Protocol.HTTP_2))
            .connectionPool(new ConnectionPool(10, 5, TimeUnit.MINUTES))
            .build();

    public CompletableFuture<String> translateVoiceToTextByFile(String filePath) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                File voiceFile = getFile(filePath);
                RequestBody body = RequestBody.create(voiceFile, MediaType.parse("application/octet-stream"));
                Request request = createRequest(body);
                return getResponse(request);
            } catch (IOException e) {
                throw new RuntimeException("Error translating voice to text: " + e.getMessage(), e);
            }
        });
    }

    public CompletableFuture<String> translateVoiceToTextByByte(byte[] bytes) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                RequestBody body = RequestBody.create(bytes, MediaType.parse("application/octet-stream"));
                Request request = createRequest(body);
                return getResponse(request);
            } catch (IOException e) {
                throw new RuntimeException("Error translating voice to text: " + e.getMessage(), e);
            }
        });
    }

    private Request createRequest(RequestBody body) {
        String apiURL = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor";
        return new Request.Builder()
                .url(apiURL)
                .addHeader("Content-Type", "application/octet-stream")
                .addHeader("X-NCP-APIGW-API-KEY-ID", clovaClientId)
                .addHeader("X-NCP-APIGW-API-KEY", clovaClientSecret)
                .post(body)
                .build();
    }

    private String getResponse(Request request) throws IOException {
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Error response from server: " + response.code() + " - " + response.body().string());
            }
            return response.body().string();
        }
    }

    private File getFile(String filePath) throws FileNotFoundException {
        File voiceFile = new File(filePath);
        if (!voiceFile.exists()) {
            throw new FileNotFoundException("File not found: " + filePath);
        }
        return voiceFile;
    }
}
