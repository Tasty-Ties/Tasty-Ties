package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.UserDTO;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import com.teamcook.tastytieschat.chat.exception.ChatRoomNotExistException;
import com.teamcook.tastytieschat.chat.exception.UserNotExistException;
import com.teamcook.tastytieschat.chat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatRoomServiceImpl(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    @Override
    public Map<String, Object> getUserAndTranslatedLanguages(String chatRoomId, int userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (chatRoom == null) {
            throw new ChatRoomNotExistException(chatRoomId);
        }

        UserDTO userDto = chatRoom.getUser(userId);
        if (userDto == null) {
            throw new UserNotExistException(userId);
        }

        Set<String> translatedLanguages = chatRoom.getLanguages();

        Map<String, Object> map = new HashMap<>();
        map.put("user", userDto);
        map.put("translatedLanguages", translatedLanguages);

        return map;
    }

}
