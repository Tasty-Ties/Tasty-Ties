package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatMessageDto;
import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import com.teamcook.tastytieschat.chat.exception.ChatRoomNotExistException;
import com.teamcook.tastytieschat.chat.exception.UserNotExistException;
import com.teamcook.tastytieschat.chat.repository.ChatMessageRepository;
import com.teamcook.tastytieschat.chat.repository.ChatRoomRepository;
import com.teamcook.tastytieschat.user.entity.User;
import com.teamcook.tastytieschat.user.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Autowired
    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository, ChatRoomRepository chatRoomRepository, UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
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
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (chatRoom == null) {
            throw new ChatRoomNotExistException(chatRoomId);
        }

        if (!chatRoom.isContainedUser(username)) {
            throw new UserNotExistException(username);
        }

        getChatUsersByChatRoom(chatRoom);

        int pgNo = requestParams.get("pgNo") == null ? 0 : Integer.parseInt(requestParams.get("pgNo").toString());

        List<ChatMessageDto> chatMessages = getChatMessagesByChatRoomId(chatRoomId, pgNo);

        result.put("pgNo", pgNo);
        result.put("chatMessages", chatMessages);
        result.put("users", chatRoom.getUsers());

        return result;
    }

    private List<ChatMessageDto> getChatMessagesByChatRoomId(String chatRoomId, int pgNo) {
        PageRequest pageRequest = PageRequest.of(pgNo, LIST_SIZE);
        List<ChatMessage> chatMessages = chatMessageRepository.findByChatRoomIdOrderByCreatedTimeDesc(chatRoomId, pageRequest).getContent();

        List<ChatMessageDto> chatMessageDtos = new ArrayList<>();
        for (ChatMessage chatMessage : chatMessages) {
            chatMessageDtos.add(new ChatMessageDto(chatMessage));
        }

        return chatMessageDtos;
    }

    private void getChatUsersByChatRoom(ChatRoom chatRoom) {
        List<UserDto> userDtos = chatRoom.getUsers();
        List<User> users = userRepository.findByUsernames(chatRoom.getUsernames());

        userDtos.sort((user1, user2) -> user1.getUsername().compareTo(user2.getUsername()));
        users.sort((user1, user2) -> user1.getUsername().compareTo(user2.getUsername()));

        log.debug("userDtos: " + userDtos.size());
        log.debug("users: " + users.size());

        int size = userDtos.size();
        for (int i = 0; i < size; i++) {
            UserDto userDto = userDtos.get(i);
            User user = users.get(i);

            userDto.setNickname(user.getNickname());
            userDto.setProfileImageUrl(user.getProfileImageUrl());
        }
    }

}
