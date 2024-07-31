package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.dto.ChatMessageRequestDTO;
import com.teamcook.tastytieschat.chat.dto.ChatMessageResponseDTO;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.service.ChatMessageService;
import com.teamcook.tastytieschat.translation.service.TranslationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.HashSet;
import java.util.Set;

@Controller
@Slf4j
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final TranslationService translationService;

    @Autowired
    public ChatMessageController(ChatMessageService chatMessageService, TranslationService translationService) {
        this.chatMessageService = chatMessageService;
        this.translationService = translationService;
    }

    @MessageMapping("/chat/rooms/{roomId}")
    @SendTo("/sub/chat/rooms/{roomId}")
    public ChatMessageResponseDTO sendMessage(@DestinationVariable String roomId, @Payload ChatMessageRequestDTO chatMessageRequestDto) {
        // TODO: 사용자가 채팅방 참가자인지 확인하기
        
        // TODO: 사용자 닉네임, 메시지 언어 가져오기
        String userNickname = "김싸피";
        String originLanguage = "Korean";

        ChatMessage chatMessage = ChatMessage.builder()
                .type(MessageType.USER)
                .chatRoomId(roomId)
                .userNickname(userNickname)
                .originLanguage(originLanguage)
                .chatMessageRequestDto(chatMessageRequestDto)
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
        chatMessageService.createChatMessage(chatMessage);

        return new ChatMessageResponseDTO(chatMessage);
    }

}
