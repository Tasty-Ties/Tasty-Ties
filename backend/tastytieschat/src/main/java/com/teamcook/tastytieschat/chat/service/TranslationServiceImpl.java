package com.teamcook.tastytieschat.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.common.config.ChatGPTConfig;
import com.teamcook.tastytieschat.chat.dto.GptRequestDto;
import com.teamcook.tastytieschat.chat.dto.GptRequestMessageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class TranslationServiceImpl implements TranslationService {

    private final ObjectMapper objectMapper;
    private final ChatGPTConfig chatGPTConfig;

    @Value("${openai.model}")
    private String model;

    public TranslationServiceImpl(ChatGPTConfig chatGPTConfig, ObjectMapper objectMapper) {
        this.chatGPTConfig = chatGPTConfig;
        this.objectMapper = objectMapper;
    }

    @Override
    public void translationChatMessage(ChatMessage chatMessage, Set<String> translatedLanguages) throws Exception {
        GptRequestDto gptRequestDto = setGptPrompt(chatMessage, translatedLanguages);

        while (validateTranslation(chatMessage, translatedLanguages)) {
            log.debug("try translation");
            ResponseEntity<String> response = callGptApi(gptRequestDto);
            handleApiResponse(chatMessage, response);
        }
    }

    private GptRequestDto setGptPrompt(ChatMessage chatMessage, Set<String> translatedLanguages) throws Exception {
        String gptPromptMessage = createGptRequestMessage(chatMessage, translatedLanguages);
        GptRequestMessageDto gptRequestMessageDto = new GptRequestMessageDto("system", gptPromptMessage, (float) 0);
        return new GptRequestDto(model, List.of(gptRequestMessageDto));
    }

    private String createGptRequestMessage(ChatMessage chatMessage, Set<String> translatedLanguages) {
        return "You are a translator with vast knowledge of human languages." +
                "Please translate the following to " +
                String.join(", ", translatedLanguages) +
                " from the next sentence. " +
                chatMessage.getOriginMessage() +
                "Output the translations in the format 'Language: Translated Text' for each language, " +
                "each on a new line.";
    }

    private ResponseEntity<String> callGptApi(GptRequestDto gptRequestDto) throws Exception {
        HttpHeaders headers = chatGPTConfig.httpHeaders();
        String requestBody = serialize(gptRequestDto);
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        return chatGPTConfig.restTemplate().exchange("https://api.openai.com/v1/chat/completions", HttpMethod.POST, requestEntity, String.class);
    }

    private String serialize(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("직렬화 실패", e);
        }
    }

    private void handleApiResponse(ChatMessage chatMessage, ResponseEntity<String> response) throws Exception {
        Map<String, Object> parsedResponseBody = deserialize(response.getBody());
        LinkedHashMap<String, Object> choices = (LinkedHashMap) ((ArrayList) parsedResponseBody.get("choices")).get(0);
        LinkedHashMap<String, Object> message = (LinkedHashMap) choices.get("message");
        String[] contents = ((String) message.get("content")).split("\n");

        for (String content : contents) {
            String[] splitedContent = content.split(": ");
            chatMessage.addTranslatedMessage(splitedContent[0], splitedContent[1]);
        }
    }

    private Map<String, Object> deserialize(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException("역직렬화 실패", e);
        }
    }

    private boolean validateTranslation(ChatMessage chatMessage, Set<String> translatedLanguages) {
        // 번역한 언어 제외
        Iterator<String> iterator = translatedLanguages.iterator();
        while (iterator.hasNext()) {
            String translatedLanguage = iterator.next();
            if (chatMessage.containTranslatedLanguage(translatedLanguage)) {
                iterator.remove();
            }
        }

        return !translatedLanguages.isEmpty();
    }

}
