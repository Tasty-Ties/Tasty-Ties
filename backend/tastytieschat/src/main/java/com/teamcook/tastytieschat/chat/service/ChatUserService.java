package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.entity.ChatUser;

public interface ChatUserService {
    void setActiveChatUser(String username);
    void setDeactiveChatUser(String username);
}
