package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatMessageDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;

import java.util.Map;

public interface ChatMessageService {

    void createChatMessage(ChatMessage ChatMessage);
    ChatMessageDto getLastChatMessageByChatRoomId(String chatRoomId);
    Map<String, Object> getChatMessagesByChatRoomId(String username, Map<String, Object> requestParams);

}
