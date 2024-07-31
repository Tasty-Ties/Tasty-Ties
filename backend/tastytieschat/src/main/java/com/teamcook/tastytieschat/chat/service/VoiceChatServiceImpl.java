package com.teamcook.tastytieschat.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamcook.tastytieschat.chat.dto.SpeechFlowCreateResponseDTO;
import com.teamcook.tastytieschat.chat.dto.SpeechFlowQueryResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;

import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class VoiceChatServiceImpl implements VoiceChatService {


    @Value("${speech-flow-key-id}")
    private String keyId;

    @Value("${speech-flow-key-secret}")
    private String keySecret;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private ConcurrentHashMap<String, ConcurrentHashMap<Integer, String[]>> voiceDataMap = new ConcurrentHashMap<>();

    public VoiceChatServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    //청크 저장
    @Override
    public synchronized void storeChunk(String roomId, int userId, int chunkIndex, int totalChunks, String chunkData) {
        voiceDataMap.putIfAbsent(roomId, new ConcurrentHashMap<>()); //ConcurrentHashMap -> 쓰기를 할 때 특정 버킷에 Lock 걸기
        ConcurrentHashMap<Integer, String[]> userChunksMap = voiceDataMap.get(roomId);

        userChunksMap.putIfAbsent(userId, new String[totalChunks]);
        userChunksMap.get(userId)[chunkIndex] = chunkData;
    }

    //모든 청크가 도착했는지 확인
    @Override
    public synchronized boolean isComplete(String roomId, int userId) {
        ConcurrentHashMap<Integer, String[]> userChunksMap = voiceDataMap.get(roomId);
        String[] chunks = userChunksMap.get(userId);
        for (String chunk : chunks) {
            if (chunk == null) {
                return false;
            }
        }
        return true;
    }

    //청크를 하나의 문자열로 재조립
    @Override
    public synchronized String assembleChunks(String roomId, int userId) {
        ConcurrentHashMap<Integer, String[]> userChunksMap = voiceDataMap.get(roomId);
        String[] chunks = userChunksMap.remove(userId);
        StringBuilder assembledData = new StringBuilder();
        for (String chunk : chunks) {
            assembledData.append(chunk);
        }
        return assembledData.toString();
    }

    @Override
    public String getConvertedString(String fullData) throws IOException {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(fullData);
        UUID uuid = UUID.randomUUID();
        //mp3 파일 만들어서 저장하기
        String filePath = "./" + uuid + ".mp3";

        OutputStream os = new FileOutputStream(filePath);
        os.write(decodedBytes);
        sendFileToSpeechFlow(filePath);

        return filePath;
    }

    /**
     * @return : TaskId
     * SpeechFlow를 안 쓸수도 있을 것 같아서 예외처리를 자세하게 하지는 않았습니다
     */
    public String sendFileToSpeechFlow(String filePath) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("keyId", keyId);
        headers.set("keySecret", keySecret);

        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("lang", "ko");
        builder.part("file", new FileSystemResource(filePath));

        HttpEntity<MultiValueMap<String, HttpEntity<?>>> requestEntity = new HttpEntity<>(builder.build(), headers);
        String url = "https://api.speechflow.io/asr/file/v1/create";
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            SpeechFlowCreateResponseDTO speechFlowCreateResponseDTO = objectMapper.readValue(response.getBody(), SpeechFlowCreateResponseDTO.class);
            if (speechFlowCreateResponseDTO.getCode() != 10000) {
                throw new IOException("실패");
            }
            return speechFlowCreateResponseDTO.getTaskId();
        } else {
            throw new IOException("실패");
        }
    }

    public String queryTranscriptionResult(String taskId) throws IOException {
        // STT 결과를 얻기 위한 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("keyId", keyId);
        headers.set("keySecret", keySecret);

        String url = "https://api.speechflow.io/asr/file/v1/query?taskId=" + taskId;
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("응답: " + response.getBody());

            // JSON 응답을 SpeechFlowResult 객체로 변환
            SpeechFlowQueryResponseDTO speechFlowQueryResponseDTO = objectMapper.readValue(response.getBody(), SpeechFlowQueryResponseDTO.class);
            if (speechFlowQueryResponseDTO.getCode() != 11000) {
                throw new IOException("실패");
            }
            return speechFlowQueryResponseDTO.getResult();
        } else {
            throw new IOException("Failed to query transcription result from SpeechFlow: " + response.getStatusCode());
        }
    }

}
