package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.constant.Language;
import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.constant.SystemMessage;
import com.teamcook.tastytieschat.chat.dto.ChatMessageRequestDto;
import com.teamcook.tastytieschat.chat.dto.ChatMessageResponseDto;
import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.chat.dto.VoiceChatRequestDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.service.*;
import com.teamcook.tastytieschat.notification.constant.NotificationType;
import com.teamcook.tastytieschat.notification.dto.FcmNotificationDto;
import com.teamcook.tastytieschat.notification.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
@Slf4j
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final TranslationService translationService;
    private final ChatRoomService chatRoomService;
    private final ChatUserService chatUserService;
    private final VoiceChatService voiceChatService;
    private final NotificationService notificationService;

    private static final Map<String, String> sessions = new HashMap<>();

    @Autowired
    public ChatMessageController(ChatMessageService chatMessageService, TranslationService translationService, ChatRoomService chatRoomService, ChatUserService chatUserService, VoiceChatService voiceChatService, NotificationService notificationService) {
        this.chatMessageService = chatMessageService;
        this.translationService = translationService;
        this.chatRoomService = chatRoomService;
        this.chatUserService = chatUserService;
        this.voiceChatService = voiceChatService;
        this.notificationService = notificationService;
    }

    @EventListener(SessionConnectedEvent.class)
    public void onConnect(SessionConnectedEvent event) {
        String sessionId = event.getMessage().getHeaders().get("simpSessionId").toString();
        try {
            Message<?> connectMessage = (Message<?>) event.getMessage().getHeaders().get("simpConnectMessage");
            Map<String, List<String>> nativeHeaders = (Map<String, List<String>>) connectMessage.getHeaders().get("nativeHeaders");

            String username = extractUsername(String.valueOf(nativeHeaders.get("username")));

            if (username != null) {
                sessions.put(sessionId, username);
                log.debug(sessions.toString());
                chatUserService.setActiveChatUser(username);
            }
        } catch (NullPointerException e) {
        }
    }

    @EventListener(SessionDisconnectEvent.class)
    public void onDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        String username = sessions.get(sessionId);
        chatUserService.setDeactiveChatUser(username);
        sessions.remove(sessionId);
    }

    private String extractUsername(String input) {
        String regex = "\\[(.*?)\\]";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(input);

        while (matcher.find()) {
            return matcher.group(1);
        }

        return null;
    }

    @MessageMapping("/chat/text/rooms/{roomId}")
    @SendTo("/sub/chat/rooms/{roomId}")
    public ChatMessageResponseDto sendMessage(@DestinationVariable String roomId, @Payload String message, SimpMessageHeaderAccessor headerAccessor) {

        try {
            String sessionId = headerAccessor.getSessionId();
            String username = sessions.get(sessionId);
            if (username == null) {
                return new ChatMessageResponseDto(SystemMessage.AUTHORIZATION_ERROR.getSystemChatMessage(roomId, "SYSTEM"));
            }

            ChatMessageRequestDto chatMessageRequest = ChatMessageRequestDto.builder()
                    .username(username)
                    .message(message)
                    .build();
            ChatMessage chatMessage = getTranslatedChatMessage(roomId, chatMessageRequest);
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
    public ChatMessageResponseDto processVoice(@DestinationVariable String roomId, @Payload VoiceChatRequestDto voiceChatRequestDTO, SimpMessageHeaderAccessor headerAccessor) throws IOException, InterruptedException {
        String sessionId = headerAccessor.getSessionId();
        String username = sessions.get(sessionId);
        if (username == null) {
            return new ChatMessageResponseDto(SystemMessage.AUTHORIZATION_ERROR.getSystemChatMessage(roomId, "SYSTEM"));
        }

        long startTime = System.currentTimeMillis();
        voiceChatService.storeChunk(roomId, voiceChatRequestDTO.getUsername(), voiceChatRequestDTO.getChunkIndex(), voiceChatRequestDTO.getTotalChunks(), voiceChatRequestDTO.getFileContent());
        long storeChunkTime = System.currentTimeMillis();
        log.info("storeChunk 소요시간: {} ms", storeChunkTime - startTime);

        String textMessage = null;
        if (voiceChatService.isComplete(roomId, voiceChatRequestDTO.getUsername())) {
            long isCompleteTime = System.currentTimeMillis();
            log.info("isComplete 소요시간: {} ms", isCompleteTime - storeChunkTime);

            log.info("음성 인식");
            String fullData = voiceChatService.assembleChunks(roomId, voiceChatRequestDTO.getUsername());
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
                new ChatMessageRequestDto(voiceChatRequestDTO.getUsername(), textMessage));
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


    private @Nullable ChatMessage getTranslatedChatMessage(String roomId, ChatMessageRequestDto chatMessageRequest) {
        Map<String, Object> map = chatRoomService.getChatRoomInfoForChatMessage(roomId, chatMessageRequest.getUsername());

        UserDto userDto = (UserDto) map.get("user");

        ChatMessage chatMessage = ChatMessage.builder()
                .type(MessageType.USER)
                .chatRoomId(roomId)
                .userType(userDto.getType())
                .username(userDto.getUsername())
                .originLanguage(userDto.getLanguage())
                .originMessage(chatMessageRequest.getMessage())
                .build();

        Set<String> translatedLanguages = (Set<String>) map.get("translatedLanguages");
        translatedLanguages.add(Language.EN.getName());  // 기본 언어 추가
        translatedLanguages.remove(userDto.getLanguage());  // 원본 언어 삭제

        try {
            translationService.translationChatMessage(chatMessage, translatedLanguages);
        } catch (Exception e) {
            log.debug("번역 실패: " + e.getMessage());
            chatMessage.setTranslated(false);
        }

        if (chatMessage.isTranslated()) {
            String chatRoomTitle = (String) map.get("chatRoomTitle");
            Set<UserDto> listeners = (Set<UserDto>) map.get("listeners");
            FcmNotificationDto notificationDto = FcmNotificationDto.builder()
                    .title(NotificationType.NEW_CHAT_MESSAGE.getTitle())
                    .body(NotificationType.NEW_CHAT_MESSAGE.generateBodyWittChatRoomTitle(chatRoomTitle))
                    .build();
            notificationService.sendMessage(listeners, notificationDto);
        }

        return chatMessage;
    }

}
