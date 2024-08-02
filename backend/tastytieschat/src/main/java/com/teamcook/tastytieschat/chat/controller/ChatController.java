package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.dto.ChatMessageDto;
import com.teamcook.tastytieschat.chat.dto.ChatRoomDto;
import com.teamcook.tastytieschat.chat.service.ChatMessageService;
import com.teamcook.tastytieschat.chat.service.ChatRoomService;
import com.teamcook.tastytieschat.common.dto.CommonResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chats")
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    @Autowired
    public ChatController(ChatRoomService chatRoomService, ChatMessageService chatMessageService) {
        this.chatRoomService = chatRoomService;
        this.chatMessageService = chatMessageService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CommonResponseDTO> getChatRooms(@PathVariable int userId) {
        List<ChatRoomDto> chatRooms = chatRoomService.getChatRooms(userId);
        for (ChatRoomDto chatRoom : chatRooms) {
            ChatMessageDto lastMessage = chatMessageService.getLastChatMessageByChatRoomId(chatRoom.getId());
            if (lastMessage != null) {
                chatRoom.setMessage(lastMessage);
            }
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("chatRooms", chatRooms);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("채팅방 목록을 성공적으로 조회했습니다.")
                        .data(responseData)
                        .build()
                );
    }

}
