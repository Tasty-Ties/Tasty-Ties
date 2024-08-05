package com.teamcook.tastytieschat.chat.service.uil;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamcook.tastytieschat.chat.dto.SpeechFlowCreateResponseDto;
import com.teamcook.tastytieschat.chat.dto.SpeechFlowQueryResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Slf4j
@Service
public class SpeechFlowUtil {

    @Value("${speech-flow-key-id}")
    private String speechFlowKeyId;

    @Value("${speech-flow-key-secret}")
    private String speechFlowKeySecret;

    private final int RETRY_CNT = 5;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public SpeechFlowUtil(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * @return : TaskId
     */
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
     */
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
