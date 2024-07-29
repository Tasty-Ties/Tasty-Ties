package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.dto.ChatRequestDTO;
import com.teamcook.tastytieschat.chat.dto.ChatResponseDTO;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
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

        // TODO: 채팅 메시지 번역하기

        // 채팅 메시지 저장하기
        chatService.createChatMessage(chatMessage);

        return new ChatResponseDTO(chatMessage);
    }

}
