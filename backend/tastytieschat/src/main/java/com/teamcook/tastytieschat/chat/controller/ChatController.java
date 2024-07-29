package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.dto.ChatRequestDTO;
import com.teamcook.tastytieschat.chat.dto.ChatResponseDTO;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.service.ChatService;
import com.teamcook.tastytieschat.translation.service.TranslationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashSet;
import java.util.Set;

@Controller
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final TranslationService translationService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController(ChatService chatService, TranslationService translationService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.translationService = translationService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/rooms/{roomId}")
    @SendTo("/sub/chat/rooms/{roomId}")
    public ChatResponseDTO sendMessage(@DestinationVariable int roomId, @Payload ChatRequestDTO chatRequestDto) {
        // TODO: 사용자 닉네임, 메시지 언어 가져오기
        String userNickname = "김싸피";
        String originLanguage = "Korean";

        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoomId(roomId)
                .userNickname(userNickname)
                .originLanguage(originLanguage)
                .chatRequestDTO(chatRequestDto)
                .build();

        // TODO: 번역할 언어 가져오기
        Set<String> translatedLanguages = new HashSet<>();
        translatedLanguages.add("English");
        translatedLanguages.add("Spanish");
        translatedLanguages.add("French");
        translatedLanguages.add("Japanese");
        translatedLanguages.add("Chinese");

        try {
            translationService.translationChatMessage(chatMessage, translatedLanguages);
        } catch (Exception e) {
            log.error("번역 실패: " + e.getMessage());
        }

        // 채팅 메시지 저장하기
        chatService.createChatMessage(chatMessage);

        return new ChatResponseDTO(chatMessage);
    }

}
