package com.teamcook.tastytieschat.chat.service.uil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.CompletableFuture;

@Service
public class ClovaUtilByHttpConnection {

    @Value("${clova-client-id}")
    private String clovaClientId;

    @Value("${clova-client-secret}")
    private String clovaClientSecret;

    public CompletableFuture<String> translateVoiceToTextByFile(String filePath) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                File voiceFile = getFile(filePath);
                HttpURLConnection connection = createConnection();
                sendFile(connection, voiceFile);
                return getResponse(connection);
            } catch (IOException e) {
                throw new RuntimeException("Error translating voice to text: " + e.getMessage(), e);
            }
        });
    }

    public CompletableFuture<String> translateVoiceToTextByByte(byte[] bytes) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                HttpURLConnection connection = createConnection();
                sendFile(connection, bytes);
                return getResponse(connection);
            } catch (IOException e) {
                throw new RuntimeException("Error translating voice to text: " + e.getMessage(), e);
            }
        });
    }

    private HttpURLConnection createConnection() throws IOException {
        String language = "Kor"; // 언어 코드 (Kor, Jpn, Eng, Chn)
        String apiURL = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=" + language;
        URL url = new URL(apiURL);

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setUseCaches(false);
        conn.setDoOutput(true);
        conn.setDoInput(true);
        conn.setRequestProperty("Content-Type", "application/octet-stream");
        conn.setRequestProperty("X-NCP-APIGW-API-KEY-ID", clovaClientId);
        conn.setRequestProperty("X-NCP-APIGW-API-KEY", clovaClientSecret);

        return conn;
    }

    private void sendFile(HttpURLConnection connection, File voiceFile) throws IOException {
        try (OutputStream outputStream = connection.getOutputStream();
             FileInputStream inputStream = new FileInputStream(voiceFile)) {

            byte[] buffer = new byte[8192]; // 버퍼 크기 증가
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.flush();
        } catch (IOException e) {
            throw new IOException("Error sending the voice file: " + e.getMessage(), e);
        }
    }

    private void sendFile(HttpURLConnection connection, byte[] bytes) throws IOException {
        try (OutputStream outputStream = connection.getOutputStream()) {
            int bufferSize = 8192; // 버퍼 크기 증가
            for (int i = 0; i < bytes.length; i += bufferSize) {
                int length = Math.min(bufferSize, bytes.length - i);
                outputStream.write(bytes, i, length);
            }
            outputStream.flush();
        } catch (IOException e) {
            throw new IOException("Error sending the voice file: " + e.getMessage(), e);
        }
    }

    private String getResponse(HttpURLConnection connection) throws IOException {
        int responseCode = connection.getResponseCode();
        try (InputStream responseStream = (responseCode == 200)
                ? connection.getInputStream()
                : connection.getErrorStream();
             BufferedReader br = new BufferedReader(new InputStreamReader(responseStream, "UTF-8"))) {

            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            if (responseCode != 200) {
                throw new IOException("Error response from server: " + responseCode + " - " + response.toString());
            }
            return response.toString();
        } catch (IOException e) {
            throw new IOException("Error reading the response: " + e.getMessage(), e);
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

