package com.teamcook.tastytieschat.chat.service.uil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class ClovaUtil {
    @Value("${clova-client-id}")
    private String clovaClientId;

    @Value("${clova-client-secret}")
    private String clovaClientSecret;


    public String translateVoiceToTextByFile(String filePath) throws IOException {
        File voiceFile = getFile(filePath);
        HttpURLConnection connection = createConnection();
        sendFile(connection, voiceFile);
        return getResponse(connection);
    }

    public String translateVoiceToTextByByte(byte[] mp3Bytes) throws IOException {
        HttpURLConnection connection = createConnection();
        sendFile(connection, mp3Bytes);
        return getResponse(connection);
    }

    private File getFile(String filePath) throws FileNotFoundException {
        File voiceFile = new File(filePath);
        if (!voiceFile.exists()) {
            throw new FileNotFoundException("File not found: " + filePath);
        }
        return voiceFile;
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

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.flush();
        } catch (IOException e) {
            throw new IOException("Error sending the voice file: " + e.getMessage(), e);
        }
    }

    private void sendFile(HttpURLConnection connection, byte[] mp3Bytes) throws IOException {
        try (OutputStream outputStream = connection.getOutputStream()) {
            outputStream.write(mp3Bytes);
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
}
