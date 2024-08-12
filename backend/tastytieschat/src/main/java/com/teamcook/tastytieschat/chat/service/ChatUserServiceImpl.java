package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.entity.ChatUser;
import com.teamcook.tastytieschat.chat.repository.ChatUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ChatUserServiceImpl implements ChatUserService {
    private final ChatUserRepository chatUserRepository;

    public ChatUserServiceImpl(ChatUserRepository chatUserRepository) {
        this.chatUserRepository = chatUserRepository;
    }

    @Override
    public void setActiveChatUser(String username) {
        ChatUser chatUser = chatUserRepository.findByUsername(username);
        if (chatUser != null) {
            chatUser.setActive(true);

            chatUserRepository.save(chatUser);
        }
    }

    @Override
    public void setDeactiveChatUser(String username) {
        ChatUser chatUser = chatUserRepository.findByUsername(username);
        if (chatUser != null) {
            chatUser.setActive(false);

            chatUserRepository.save(chatUser);
        }
    }
}
