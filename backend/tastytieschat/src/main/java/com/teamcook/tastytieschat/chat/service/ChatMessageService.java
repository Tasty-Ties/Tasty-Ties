package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatMessageDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;

public interface ChatMessageService {

    void createChatMessage(ChatMessage ChatMessage);
    ChatMessageDto getLastChatMessageByChatRoomId(String chatRoomId);

}
