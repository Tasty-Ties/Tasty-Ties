package com.teamcook.tastytieschat.chat.repository;

import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findByIdIn(Set<String> ids);
}
