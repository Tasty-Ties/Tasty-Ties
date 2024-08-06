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
    public Map<String, Object> getUserAndTranslatedLanguages(String chatRoomId, int userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (chatRoom == null) {
            throw new ChatRoomNotExistException(chatRoomId);
        }

        UserDto userDto = chatRoom.getUser(userId);
        if (userDto == null) {
            throw new UserNotExistException(userId);
        }

        Set<String> translatedLanguages = chatRoom.getLanguages();

        Map<String, Object> map = new HashMap<>();
        map.put("user", userDto);
        map.put("translatedLanguages", translatedLanguages);

        return map;
    }

    @Override
    public List<ChatRoomDto> getChatRooms(int userId) {
        ChatUser chatUser = chatUserRepository.findByUserId(userId);
        if (chatUser == null) {
            throw new UserNotExistException(userId);
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
