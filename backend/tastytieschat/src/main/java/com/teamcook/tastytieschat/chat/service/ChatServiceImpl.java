package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;

    @Autowired
    public ChatServiceImpl(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Override
    public void createChatMessage(ChatMessage ChatMessage) {
        chatRepository.save(ChatMessage);
    }
}
