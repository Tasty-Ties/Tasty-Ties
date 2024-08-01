package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.dto.ChatMessageRequestDTO;
import com.teamcook.tastytieschat.chat.dto.ChatMessageResponseDTO;
import com.teamcook.tastytieschat.chat.dto.UserDTO;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.service.ChatMessageService;
import com.teamcook.tastytieschat.chat.service.ChatRoomService;
import com.teamcook.tastytieschat.chat.service.TranslationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.Set;

@Controller
@Slf4j
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final TranslationService translationService;
    private final ChatRoomService chatRoomService;

    @Autowired
    public ChatMessageController(ChatMessageService chatMessageService, TranslationService translationService, ChatRoomService chatRoomService) {
        this.chatMessageService = chatMessageService;
        this.translationService = translationService;
        this.chatRoomService = chatRoomService;
    }

    @MessageMapping("/chat/rooms/{roomId}")
    @SendTo("/sub/chat/rooms/{roomId}")
    public ChatMessageResponseDTO sendMessage(@DestinationVariable String roomId, @Payload ChatMessageRequestDTO chatMessageRequestDto) {
        try {
            Map<String, Object> map = chatRoomService.getUserAndTranslatedLanguages(roomId, chatMessageRequestDto.getUserId());

            UserDTO userDto = (UserDTO) map.get("user");

            ChatMessage chatMessage = ChatMessage.builder()
                    .type(MessageType.USER)
                    .chatRoomId(roomId)
                    .userNickname(userDto.getNickname())
                    .originLanguage(userDto.getLanguage())
                    .chatMessageRequestDto(chatMessageRequestDto)
                    .build();

            // TODO: 번역할 언어 가져오기
            Set<String> translatedLanguages = (Set<String>) map.get("translatedLanguages");

            try {
                translationService.translationChatMessage(chatMessage, translatedLanguages);
            } catch (Exception e) {
                log.error("번역 실패: " + e.getMessage());
                return null;
            }

            // 채팅 메시지 저장하기
            chatMessageService.createChatMessage(chatMessage);

            return new ChatMessageResponseDTO(chatMessage);
        } catch (Exception e) {
            log.error("채팅방 권한 실패: " + e.getMessage());
            return null;
        }
    }

}
