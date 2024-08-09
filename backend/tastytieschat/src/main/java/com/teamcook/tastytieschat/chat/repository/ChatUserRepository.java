package com.teamcook.tastytieschat.chat.repository;

import com.teamcook.tastytieschat.chat.entity.ChatUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatUserRepository extends MongoRepository<ChatUser, String> {
    ChatUser findByUsername(String username);
}
