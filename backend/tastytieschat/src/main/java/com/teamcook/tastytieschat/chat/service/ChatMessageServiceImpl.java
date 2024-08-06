package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatMessageDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.repository.ChatMessageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class ChatMessageServiceImpl implements ChatMessageService {

    private final static int LIST_SIZE = 30;

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

    @Override
    public Map<String, Object> getChatMessagesByChatRoomId(Map<String, Object> requestParams) {
        Map<String, Object> result = new HashMap<>();

        String chatRoomId = (String)requestParams.get("chatRoomId");
        int pgNo = requestParams.get("pgNo") == null ? 0 : Integer.parseInt(requestParams.get("pgNo").toString());

        List<ChatMessageDto> chatMessages = getChatMessagesByChatRoomId(chatRoomId, pgNo);

        result.put("pgNo", pgNo);
        result.put("chatMessages", chatMessages);

        return result;
    }

    private List<ChatMessageDto> getChatMessagesByChatRoomId(String chatRoomId, int pgNo) {
        PageRequest pageRequest = PageRequest.of(pgNo, LIST_SIZE);
        List<ChatMessage> chatMessages = chatMessageRepository.findByChatRoomIdOrderByCreatedTimeDesc(chatRoomId, pageRequest).getContent();

        List<ChatMessageDto> chatMessageDtos = new ArrayList<>();
        for (ChatMessage chatMessage : chatMessages) {
            log.debug(chatMessage.getOriginMessage());
            chatMessageDtos.add(new ChatMessageDto(chatMessage));
        }

        return chatMessageDtos;
    }

}
