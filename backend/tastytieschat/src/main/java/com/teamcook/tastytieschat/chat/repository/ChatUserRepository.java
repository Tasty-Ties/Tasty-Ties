package com.teamcook.tastytieschat.chat.repository;

import com.teamcook.tastytieschat.chat.entity.ChatUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Set;

public interface ChatUserRepository extends MongoRepository<ChatUser, String> {
    ChatUser findByUsername(String username);
    @Query("{ 'username': { $in: ?0 }, 'isActive': true }")
    Set<ChatUser> findByUsernameInAndIsActiveTrue(List<String> usernames);
}
