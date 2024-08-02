package com.teamcook.tastytieschat.chat.repository;

import com.teamcook.tastytieschat.chat.constant.MessageType;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    @Query("{ 'chatRoomId': ?0, 'type': ?1}")
    List<ChatMessage> findFirstByChatRoomIdAndTypeOrderByCreatedTimeDesc(String chatRoomId, MessageType type, Pageable page);

    default Optional<ChatMessage> findLastUserMessage(String chatRoomId) {
        List<ChatMessage> messages = findFirstByChatRoomIdAndTypeOrderByCreatedTimeDesc(chatRoomId, MessageType.USER, PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "createdTime")));
        return messages.isEmpty() ? Optional.empty() : Optional.of(messages.get(0));
    }
}