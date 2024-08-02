package com.teamcook.tastytieschat.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamcook.tastytieschat.chat.dto.SpeechFlowCreateResponseDto;
import com.teamcook.tastytieschat.chat.dto.SpeechFlowQueryResponseDto;
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
    private String speechFlowKeyId;

    @Value("${speech-flow-key-secret}")
    private String speechFlowKeySecret;

    @Value("${clova-api-id}")
    private String ClovaApiId;

    @Value("${clova-api-key}")
    private String ClovaApiKey;


    @Value("${ffmpeg.path}")
    private String ffmpegPath;

    private final int RETRY_CNT = 5;
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

    public String translateVoiceToTextByClova(){
        return null;
    }


    /**
     * @param fullData : 인코딩된 문자열
     * @return : mp3 파일이 저장된 경로 full path
     * */
    @Override
    public String getMp3filePath(String fullData) throws IOException, InterruptedException {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(fullData);
        UUID uuid = UUID.randomUUID();
        String wavFilePath = "./static/" + uuid + ".wav";
        String mp3FilePath = "./static/" + uuid + ".mp3";

        // 디코딩된 바이트를 WAV 파일로 저장
        try (OutputStream os = new FileOutputStream(wavFilePath)) {
            os.write(decodedBytes);
        }

        // ffmpeg를 사용하여 WAV 파일을 MP3로 변환
        ProcessBuilder pb = new ProcessBuilder(ffmpegPath, "-i", wavFilePath, mp3FilePath);
        Process process = pb.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IOException("Error converting WAV to MP3");
        }

        sendFileToSpeechFlow(mp3FilePath);
        return mp3FilePath;
    }

    /**
     * @return : TaskId
     */
    @Override
    public String sendFileToSpeechFlow(String filePath) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("keyId", speechFlowKeyId);
        headers.set("keySecret", speechFlowKeySecret);

        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("lang", "ko");
        builder.part("file", new FileSystemResource(filePath));

        HttpEntity<MultiValueMap<String, HttpEntity<?>>> requestEntity = new HttpEntity<>(builder.build(), headers);
        String url = "https://api.speechflow.io/asr/file/v1/create";
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            SpeechFlowCreateResponseDto speechFlowCreateResponseDTO = objectMapper.readValue(response.getBody(), SpeechFlowCreateResponseDto.class);
            if (speechFlowCreateResponseDTO.getCode() != 10000) {
                throw new IOException("실패");
            }
            return speechFlowCreateResponseDTO.getTaskId();
        } else {
            throw new IOException("실패");
        }
    }

    /**
     * @return : 변환된 문자열
     * */
    @Override
    public String queryTranscriptionResult(String taskId) throws IOException, InterruptedException {
        // STT 결과를 얻기 위한 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("keyId", speechFlowKeyId);
        headers.set("keySecret", speechFlowKeySecret);

        String url = "https://api.speechflow.io/asr/file/v1/query?taskId=" + taskId;
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);

        // JSON 응답을 SpeechFlowResult 객체로 변환
        int count = 0;
        while (count < RETRY_CNT) {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("응답: {}", response.getBody());
                SpeechFlowQueryResponseDto speechFlowQueryResponseDTO =
                        objectMapper.readValue(response.getBody(), SpeechFlowQueryResponseDto.class);
                if (speechFlowQueryResponseDTO.getCode() == 11000) {
                    return speechFlowQueryResponseDTO.getResult();
                } else if (speechFlowQueryResponseDTO.getCode() == 11001) {
                    //처리가 아직 되지 않았음
                    log.info("5초 대기");
                    count++;
                    Thread.sleep(5000); // 5초 대기
                } else {
                    break;
                }
            }
        }

        throw new IOException("실패");
    }

}
