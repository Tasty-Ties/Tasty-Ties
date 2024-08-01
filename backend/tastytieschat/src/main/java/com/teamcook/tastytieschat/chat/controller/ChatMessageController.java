package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.dto.ChatMessageRequestDTO;
import com.teamcook.tastytieschat.chat.dto.ChatMessageResponseDTO;
import com.teamcook.tastytieschat.chat.dto.UserDTO;
import com.teamcook.tastytieschat.chat.dto.VoiceChatRequestDTO;
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
    private final VoiceChatServiceImpl voiceChatServiceImpl;

    @Autowired
    public ChatMessageController(ChatMessageService chatMessageService, TranslationService translationService, ChatRoomService chatRoomService, VoiceChatServiceImpl voiceChatServiceImpl) {
        this.chatMessageService = chatMessageService;
        this.translationService = translationService;
        this.chatRoomService = chatRoomService;
        this.voiceChatServiceImpl = voiceChatServiceImpl;
    }

    @MessageMapping("/chat/text/rooms/{roomId}")
    @SendTo("/sub/chat/rooms/{roomId}")
    public ChatMessageResponseDTO sendMessage(@DestinationVariable String roomId, @Payload ChatMessageRequestDTO chatMessageRequestDto) {
        System.out.println("텍스트 채팅");
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

    @MessageMapping("/chat/voice/rooms/{roomId}")
    @SendTo("/sub/chat/rooms/{roomId}")
    public ChatMessageResponseDTO processVoice(@DestinationVariable String roomId, @Payload VoiceChatRequestDTO voiceChatRequestDTO) throws IOException, InterruptedException {

        voiceChatServiceImpl.storeChunk(roomId, voiceChatRequestDTO.getUserId(), voiceChatRequestDTO.getChunkIndex(), voiceChatRequestDTO.getTotalChunks(), voiceChatRequestDTO.getFileContent());
        if (voiceChatServiceImpl.isComplete(roomId, voiceChatRequestDTO.getUserId())) {
            //청크 재조립
            System.out.println("음성 인식");
            String fullData = voiceChatServiceImpl.assembleChunks(roomId, voiceChatRequestDTO.getUserId());
            String convertedString = voiceChatServiceImpl.getConvertedString(fullData);

            //번역

        }
        return new ChatMessageResponseDTO();
    }

}
