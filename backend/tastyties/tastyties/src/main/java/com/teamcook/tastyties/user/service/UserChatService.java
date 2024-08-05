package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.cooking_class.dto.ChatUserDto;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserChatService {

    private final UserRepository userRepository;

    @Autowired
    public UserChatService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public ChatUserDto getUser(Integer userId) {
        User user = userRepository.findUserWithLanguage(userId);

        return ChatUserDto.builder()
                .id(userId)
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfileImageUrl())
                .language(user.getLanguage().getEnglish())
                .build();
    }

}
