package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatRoomRequestDTO;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;

public interface ChatMessageService {

    void createChatMessage(ChatMessage ChatMessage);

}
