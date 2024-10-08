package com.teamcook.tastytieschat.chat.controller;

import com.teamcook.tastytieschat.chat.dto.ChatMessageDto;
import com.teamcook.tastytieschat.chat.dto.ChatRoomDto;
import com.teamcook.tastytieschat.chat.service.ChatMessageService;
import com.teamcook.tastytieschat.chat.service.ChatRoomService;
import com.teamcook.tastytieschat.common.dto.CommonResponseDTO;
import com.teamcook.tastytieschat.security.userdetails.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/chatapi/chats")
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    @Autowired
    public ChatController(ChatRoomService chatRoomService, ChatMessageService chatMessageService) {
        this.chatRoomService = chatRoomService;
        this.chatMessageService = chatMessageService;
    }

    @GetMapping("/rooms")
    public ResponseEntity<CommonResponseDTO> getChatRooms(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String username = userDetails.getUsername();

        List<ChatRoomDto> chatRooms = chatRoomService.getChatRooms(username);
        for (ChatRoomDto chatRoom : chatRooms) {
            ChatMessageDto lastMessage = chatMessageService.getLastChatMessageByChatRoomId(chatRoom.getId());
            if (lastMessage != null) {
                chatRoom.setMessage(lastMessage);
            }
        }

        chatRooms = sortChatRoomDtos(chatRooms);

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

    private List<ChatRoomDto> sortChatRoomDtos(List<ChatRoomDto> chatRoomDtos) {
        return chatRoomDtos.stream()
                .sorted(Comparator.comparing(dto ->
                                dto.getMessage() != null ?
                                        dto.getMessage().getCreatedTime() : dto.getCreatedTime(),
                        Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    @GetMapping("")
    public ResponseEntity<CommonResponseDTO> getChatMessages(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam Map<String, Object> requestParams) {
        String username = userDetails.getUsername();

        Map<String, Object> responseData = chatMessageService.getChatMessagesByChatRoomId(username, requestParams);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("채팅 메시지를 성공적으로 조회했습니다.")
                        .data(responseData)
                        .build());
    }

}
