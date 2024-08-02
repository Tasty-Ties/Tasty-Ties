package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatMessageDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public void createChatMessage(ChatMessage ChatMessage) {
        chatMessageRepository.save(ChatMessage);
    }

    @Override
    public ChatMessageDto getLastChatMessageByChatRoomId(String chatRoomId) {
        Optional<ChatMessage> chatMessage = chatMessageRepository.findLastUserMessage(chatRoomId);

        if (chatMessage.isPresent()) {
            return new ChatMessageDto(chatMessage.get());
        } else {
            return null;
        }
    }

}
