package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatRoomRequestDTO;
import com.teamcook.tastytieschat.chat.dto.UserDTO;

public interface ChatRoomService {
    String createChatRoom(ChatRoomRequestDTO chatRoomRequestDto);
    void deleteChatRoom(String chatRoomId);
    void enterChatRoom(String chatRoomId, UserDTO userDto);
    String exitChatRoom(String chatRoomId, int userID);
}
