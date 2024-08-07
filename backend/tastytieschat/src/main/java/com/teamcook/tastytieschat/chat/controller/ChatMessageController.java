package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.constant.Language;
import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.dto.ChatMessageRequestDto;
import com.teamcook.tastytieschat.chat.dto.ChatMessageResponseDto;
import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.chat.dto.VoiceChatRequestDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.service.*;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

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
            ChatMessage chatMessage = getTranslatedChatMessage(roomId, chatMessageRequestDto);
            if (chatMessage == null) return null;

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
        long startTime = System.currentTimeMillis();
        voiceChatService.storeChunk(roomId, voiceChatRequestDTO.getUserId(), voiceChatRequestDTO.getChunkIndex(), voiceChatRequestDTO.getTotalChunks(), voiceChatRequestDTO.getFileContent());
        long storeChunkTime = System.currentTimeMillis();
        log.info("storeChunk 소요시간: {} ms", storeChunkTime - startTime);

        String textMessage = null;
        if (voiceChatService.isComplete(roomId, voiceChatRequestDTO.getUserId())) {
            long isCompleteTime = System.currentTimeMillis();
            log.info("isComplete 소요시간: {} ms", isCompleteTime - storeChunkTime);

            log.info("음성 인식");
            String fullData = voiceChatService.assembleChunks(roomId, voiceChatRequestDTO.getUserId());
            long assembleChunksTime = System.currentTimeMillis();
            log.info("assembleChunks 소요시간: {} ms", assembleChunksTime - isCompleteTime);

            CompletableFuture<String> resultFuture = voiceChatService.translateVoiceToTextByMemory(fullData);
            textMessage = resultFuture.join();
            long translateVoiceToTextTime = System.currentTimeMillis();
            log.info("translateVoiceToText 소요시간: {} ms", translateVoiceToTextTime - assembleChunksTime);
        }

        if (textMessage == null) {
            return null;
        }

        long beforeTranslationTime = System.currentTimeMillis();
        ChatMessage chatMessage = getTranslatedChatMessage(roomId,
                new ChatMessageRequestDto(voiceChatRequestDTO.getUserId(), textMessage));
        long afterTranslationTime = System.currentTimeMillis();
        log.info("getTranslatedChatMessage 소요시간: {} ms", afterTranslationTime - beforeTranslationTime);

        if (chatMessage == null) {
            return null;
        }

        chatMessageService.createChatMessage(chatMessage);
        long createChatMessageTime = System.currentTimeMillis();
        log.info("createChatMessage 소요시간: {} ms", createChatMessageTime - afterTranslationTime);

        return new ChatMessageResponseDto(chatMessage);
    }


    private @Nullable ChatMessage getTranslatedChatMessage(String roomId, ChatMessageRequestDto chatMessageRequestDto) {
        Map<String, Object> map = chatRoomService.getUserAndTranslatedLanguages(roomId, chatMessageRequestDto.getUserId());

        UserDto userDto = (UserDto) map.get("user");

        ChatMessage chatMessage = ChatMessage.builder()
                .type(MessageType.USER)
                .chatRoomId(roomId)
                .userType(userDto.getType())
                .userNickname(userDto.getNickname())
                .originLanguage(userDto.getLanguage())
                .chatMessageRequestDto(chatMessageRequestDto)
                .build();

        Set<String> translatedLanguages = (Set<String>) map.get("translatedLanguages");
        translatedLanguages.add(Language.EN.getName());

        try {
            translationService.translationChatMessage(chatMessage, translatedLanguages);
        } catch (Exception e) {
            log.error("번역 실패: " + e.getMessage());
            return null;
        }
        return chatMessage;
    }

}
