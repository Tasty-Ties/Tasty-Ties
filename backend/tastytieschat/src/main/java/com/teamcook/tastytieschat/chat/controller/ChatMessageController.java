package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.dto.ChatMessageRequestDto;
import com.teamcook.tastytieschat.chat.dto.ChatMessageResponseDto;
import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.chat.dto.VoiceChatRequestDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

@Controller
@Slf4j
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final TranslationService translationService;
    private final ChatRoomService chatRoomService;
    private final VoiceChatService voiceChatService;

    @Autowired
    public ChatMessageController(ChatMessageService chatMessageService, TranslationService translationService, ChatRoomService chatRoomService, VoiceChatService voiceChatService) {
        this.chatMessageService = chatMessageService;
        this.translationService = translationService;
        this.chatRoomService = chatRoomService;
        this.voiceChatService = voiceChatService;
    }

    @MessageMapping("/chat/text/rooms/{roomId}")
    @SendTo("/sub/chat/rooms/{roomId}")
    public ChatMessageResponseDto sendMessage(@DestinationVariable String roomId, @Payload ChatMessageRequestDto chatMessageRequestDto) {
        try {
            Map<String, Object> map = chatRoomService.getUserAndTranslatedLanguages(roomId, chatMessageRequestDto.getUserId());

            UserDto userDto = (UserDto) map.get("user");

            ChatMessage chatMessage = ChatMessage.builder()
                    .type(MessageType.USER)
                    .chatRoomId(roomId)
                    .userNickname(userDto.getNickname())
                    .originLanguage(userDto.getLanguage())
                    .chatMessageRequestDto(chatMessageRequestDto)
                    .build();

            Set<String> translatedLanguages = (Set<String>) map.get("translatedLanguages");

            try {
                translationService.translationChatMessage(chatMessage, translatedLanguages);
            } catch (Exception e) {
                log.error("번역 실패: " + e.getMessage());
                return null;
            }

            // 채팅 메시지 저장하기
            chatMessageService.createChatMessage(chatMessage);

            return new ChatMessageResponseDto(chatMessage);
        } catch (Exception e) {
            log.error("채팅방 권한 실패: " + e.getMessage());
            return null;
        }
    }

    @MessageMapping("/chat/voice/rooms/{roomId}")
    @SendTo("/sub/chat/rooms/{roomId}")
    public ChatMessageResponseDto processVoice(@DestinationVariable String roomId, @Payload VoiceChatRequestDto voiceChatRequestDTO) throws IOException, InterruptedException {

        voiceChatService.storeChunk(roomId, voiceChatRequestDTO.getUserId(), voiceChatRequestDTO.getChunkIndex(), voiceChatRequestDTO.getTotalChunks(), voiceChatRequestDTO.getFileContent());
        if (voiceChatService.isComplete(roomId, voiceChatRequestDTO.getUserId())) {
            //청크 재조립
            log.info("음성 인식");
            String fullData = voiceChatService.assembleChunks(roomId, voiceChatRequestDTO.getUserId());
            String result = voiceChatService.translateVoiceToText(fullData);

            //번역
        }
        return new ChatMessageResponseDto();
    }

}
