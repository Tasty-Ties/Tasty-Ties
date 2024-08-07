package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatRoomDto;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;

import java.util.List;
import java.util.Map;

public interface ChatRoomService {
    Map<String, Object> getChatRoomInfoForChatMessage(String chatRoomId, int userId);
    List<ChatRoomDto> getChatRooms(int userId);
}
