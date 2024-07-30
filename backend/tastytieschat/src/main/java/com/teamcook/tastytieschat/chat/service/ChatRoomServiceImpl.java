package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.ChatRoomRequestDTO;
import com.teamcook.tastytieschat.chat.dto.UserDTO;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import com.teamcook.tastytieschat.chat.exception.ChatRoomNotExistException;
import com.teamcook.tastytieschat.chat.exception.UserAlreadyExistException;
import com.teamcook.tastytieschat.chat.exception.UserNotExistException;
import com.teamcook.tastytieschat.chat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatRoomServiceImpl(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    @Override
    public String createChatRoom(ChatRoomRequestDTO chatRoomRequestDto) {
        ChatRoom chatRoom = new ChatRoom(chatRoomRequestDto);
        chatRoomRepository.save(chatRoom);

        return chatRoom.getId();
    }

    @Override
    public void deleteChatRoom(String chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            chatRoomRepository.delete(chatRoom);
        } else {
            throw new ChatRoomNotExistException(chatRoomId);
        }
    }

    @Override
    public void enterChatRoom(String chatRoomId, UserDTO userDto) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            if (chatRoom.getUsers().contains(userDto)) {
                throw new UserAlreadyExistException(userDto.getId());
            }

            chatRoom.getUsers().add(userDto);
            chatRoomRepository.save(chatRoom);
        } else {
            throw new ChatRoomNotExistException(chatRoomId);
        }
    }

    @Override
    public String exitChatRoom(String chatRoomId, int userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            if (chatRoom.containUser(userId)) {
                String removedUserNickname = chatRoom.removeUser(userId);

                chatRoomRepository.save(chatRoom);

                return removedUserNickname;
            } else {
                throw new UserNotExistException(userId);
            }
        } else {
            throw new ChatRoomNotExistException(chatRoomId);
        }
    }
}
