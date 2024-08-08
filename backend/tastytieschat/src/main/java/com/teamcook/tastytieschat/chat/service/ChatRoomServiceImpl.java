package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatRoomDto;
import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import com.teamcook.tastytieschat.chat.entity.ChatUser;
import com.teamcook.tastytieschat.chat.exception.ChatRoomNotExistException;
import com.teamcook.tastytieschat.chat.exception.UserNotExistException;
import com.teamcook.tastytieschat.chat.repository.ChatRoomRepository;
import com.teamcook.tastytieschat.chat.repository.ChatUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatUserRepository chatUserRepository;

    @Autowired
    public ChatRoomServiceImpl(ChatRoomRepository chatRoomRepository, ChatUserRepository chatUserRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatUserRepository = chatUserRepository;
    }

    @Override
    public Map<String, Object> getChatRoomInfoForChatMessage(String chatRoomId, String username) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (chatRoom == null) {
            throw new ChatRoomNotExistException(chatRoomId);
        }

        UserDto userDto = chatRoom.getUser(username);
        if (userDto == null) {
            throw new UserNotExistException(username);
        }

        Set<UserDto> listeners = chatRoom.getListeners(username);
        Set<String> translatedLanguages = chatRoom.getLanguages();

        Map<String, Object> map = new HashMap<>();
        map.put("chatRoomTitle", chatRoom.getTitle());
        map.put("user", userDto);
        map.put("listeners", listeners);
        map.put("translatedLanguages", translatedLanguages);

        return map;
    }

    @Override
    public List<ChatRoomDto> getChatRooms(String username) {
        ChatUser chatUser = chatUserRepository.findByUsername(username);
        if (chatUser == null) {
            throw new UserNotExistException(username);
        }

        Set<String> chatRoomIds = chatUser.getChatRoomIds();
        List<ChatRoom> chatRooms = chatRoomRepository.findByIdIn(chatRoomIds);

        List<ChatRoomDto> chatRoomDtos = new ArrayList<>();
        for (ChatRoom chatRoom : chatRooms) {
            chatRoomDtos.add(ChatRoomDto.builder()
                    .id(chatRoom.getId())
                    .title(chatRoom.getTitle())
                    .imageUrl(chatRoom.getImageUrl())
                    .build());
        }

        return chatRoomDtos;
    }

}
