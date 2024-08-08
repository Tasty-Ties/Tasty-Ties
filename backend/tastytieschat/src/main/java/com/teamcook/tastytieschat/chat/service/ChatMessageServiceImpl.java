package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatMessageDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import com.teamcook.tastytieschat.chat.exception.ChatRoomNotExistException;
import com.teamcook.tastytieschat.chat.exception.UserNotExistException;
import com.teamcook.tastytieschat.chat.repository.ChatMessageRepository;
import com.teamcook.tastytieschat.chat.repository.ChatRoomRepository;
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
    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository, ChatRoomRepository chatRoomRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
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
    public Map<String, Object> getChatMessagesByChatRoomId(String username, Map<String, Object> requestParams) {
        Map<String, Object> result = new HashMap<>();

        String chatRoomId = (String)requestParams.get("chatRoomId");
        if (!isContainedUser(chatRoomId, username)) {
            throw new UserNotExistException(username);
        }

        int pgNo = requestParams.get("pgNo") == null ? 0 : Integer.parseInt(requestParams.get("pgNo").toString());

        List<ChatMessageDto> chatMessages = getChatMessagesByChatRoomId(chatRoomId, pgNo);

        result.put("pgNo", pgNo);
        result.put("chatMessages", chatMessages);

        return result;
    }

    private boolean isContainedUser(String chatRoomId, String username) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (chatRoom != null) {
            return chatRoom.isContainedUser(username);
        } else {
            throw new ChatRoomNotExistException(chatRoomId);
        }
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
