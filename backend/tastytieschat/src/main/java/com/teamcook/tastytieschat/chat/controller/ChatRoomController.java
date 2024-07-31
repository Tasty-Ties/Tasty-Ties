package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.constant.SystemMessage;
import com.teamcook.tastytieschat.chat.dto.ChatRoomRequestDTO;
import com.teamcook.tastytieschat.chat.dto.UserDTO;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.service.ChatMessageService;
import com.teamcook.tastytieschat.chat.service.ChatRoomService;
import com.teamcook.tastytieschat.common.dto.CommonResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chats")
@Slf4j
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    @Autowired
    public ChatRoomController(ChatRoomService chatRoomService, ChatMessageService chatMessageService) {
        this.chatRoomService = chatRoomService;
        this.chatMessageService = chatMessageService;
    }

    @PostMapping()
    public ResponseEntity<CommonResponseDTO> createChatRoom(@RequestBody ChatRoomRequestDTO chatRoomRequestDto) {
        String chatRoomId = chatRoomService.createChatRoom(chatRoomRequestDto);

        ChatMessage chatMessage = createSystemChatMessage(chatRoomId, chatRoomRequestDto.getUser().getNickname(), SystemMessage.ENTER);

        chatMessageService.createChatMessage(chatMessage);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("chatRoomId", chatRoomId);

        return ResponseEntity.status(201)
                .body(CommonResponseDTO.builder()
                        .stateCode(201)
                        .message("채팅방이 정상적으로 생성됐습니다.")
                        .data(responseData)
                        .build());
    }

    @DeleteMapping("/{chatRoomId}")
    public ResponseEntity<CommonResponseDTO> deleteChatRoom(@PathVariable String chatRoomId) {
        chatRoomService.deleteChatRoom(chatRoomId);

        return ResponseEntity.status(200)
                .body(CommonResponseDTO.builder()
                        .stateCode(204)
                        .message("채팅방이 정상적으로 삭제됐습니다.")
                        .build());
    }

    @PostMapping("/{chatRoomId}")
    public ResponseEntity<CommonResponseDTO> enterChatRoom(@PathVariable String chatRoomId, @RequestBody UserDTO userDto) {
        chatRoomService.enterChatRoom(chatRoomId, userDto);

        ChatMessage chatMessage = createSystemChatMessage(chatRoomId, userDto.getNickname(), SystemMessage.ENTER);

        chatMessageService.createChatMessage(chatMessage);

        return ResponseEntity.status(200)
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("채팅방에 정상적으로 초대됐습니다.")
                        .build());
    }

    @DeleteMapping("/{chatRoomId}/{userId}")
    public ResponseEntity<CommonResponseDTO> exitChatRoom(@PathVariable String chatRoomId, @PathVariable int userId) {
        String removedUserNickname = chatRoomService.exitChatRoom(chatRoomId, userId);

        ChatMessage chatMessage = createSystemChatMessage(chatRoomId, removedUserNickname, SystemMessage.EXIT);

        chatMessageService.createChatMessage(chatMessage);

        return ResponseEntity.status(200)
                .body(CommonResponseDTO.builder()
                        .stateCode(204)
                        .message("채팅방에 정상적으로 퇴장했습니다.")
                        .build());
    }

    private ChatMessage createSystemChatMessage(String chatRoomId, String userNickname, SystemMessage systemMessage) {
        ChatMessage chatMessage = ChatMessage.builder()
                .type(MessageType.SYSTEM)
                .chatRoomId(chatRoomId)
                .build();

        systemMessage.setSystemChatMessage(userNickname, chatMessage);

        return chatMessage;
    }

}
