package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.constant.SystemMessage;
import com.teamcook.tastytieschat.chat.dto.RabbitMQRequestDto;
import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.chat.entity.ChatMessage;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import com.teamcook.tastytieschat.chat.entity.ChatUser;
import com.teamcook.tastytieschat.chat.exception.UserHasNoChatRoomException;
import com.teamcook.tastytieschat.chat.repository.ChatMessageRepository;
import com.teamcook.tastytieschat.chat.repository.ChatRoomRepository;
import com.teamcook.tastytieschat.chat.repository.ChatUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class RabbitMQConsumerImpl implements RabbitMQConsumer {

    private final ChatRoomRepository chatRoomRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ChatUserRepository chatUserRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public RabbitMQConsumerImpl(ChatRoomRepository chatRoomRepository, RabbitTemplate rabbitTemplate, ChatUserRepository chatUserRepository, ChatMessageRepository chatMessageRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.chatUserRepository = chatUserRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(
                    value = "${rabbitmq.queue.host}",
                    durable = "true"
            ),
            exchange = @Exchange(value = "${rabbitmq.exchange")
    ))
    public void hostChatRoom(RabbitMQRequestDto rabbitMQRequestDto, Message message) {
        switch (rabbitMQRequestDto.getType()) {
            case CREATE:
                createChatRoom(rabbitMQRequestDto, message);
                break;
            case DELETE:
                deleteChatRoom(rabbitMQRequestDto);
                break;
        }
    }

    private void createChatRoom(RabbitMQRequestDto rabbitMQRequestDto, Message message) {
        ChatRoom chatRoom = new ChatRoom(rabbitMQRequestDto.getTitle(), rabbitMQRequestDto.getImageUrl(), rabbitMQRequestDto.getUser());
        chatRoomRepository.save(chatRoom);

        addChatRoomOfChatUser(rabbitMQRequestDto.getUsername(), chatRoom.getId());

        Map<String, String> responseData = new HashMap<>();
        responseData.put("chatRoomId", chatRoom.getId());

        String replyTo = message.getMessageProperties().getReplyTo();
        String correlationId = message.getMessageProperties().getCorrelationId();

        rabbitTemplate.convertAndSend(replyTo, responseData, msg -> {
            msg.getMessageProperties().setCorrelationId(correlationId);
            return msg;
        });
    }

    private void deleteChatRoom(RabbitMQRequestDto rabbitMQRequestDto) {
        String chatRoomId = rabbitMQRequestDto.getChatRoomId();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            chatRoomRepository.delete(chatRoom);
            removeChatRoomOfChatUsers(chatRoom);
        } else {
            log.error("Error deleting chat room: chat room does not exist.");
        }
    }

    private void removeChatRoomOfChatUsers(ChatRoom chatRoom) {
        if (chatRoom != null) {
            List<ChatUser> chatUsers = new ArrayList<>();
            for (UserDto user : chatRoom.getUsers()) {
                ChatUser chatUser = chatUserRepository.findByUsername(user.getUsername());
                chatUser.removeChatRoomId(chatRoom.getId());
                chatUsers.add(chatUser);
            }

            if (!chatUsers.isEmpty()) {
                chatUserRepository.saveAll(chatUsers);
            }
        }
    }

    @Override
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(
                    value = "${rabbitmq.queue.attendee}",
                    durable = "true"
            ),
            exchange = @Exchange(value = "${rabbitmq.exchange")
    ))
    public void attendeeChatRoom(RabbitMQRequestDto rabbitMQRequestDto) {
        switch (rabbitMQRequestDto.getType()) {
            case JOIN:
                enterChatRoom(rabbitMQRequestDto);
                break;
            case LEAVE:
                leaveChatRoom(rabbitMQRequestDto);
                break;
        }
    }

    private void enterChatRoom(RabbitMQRequestDto rabbitMQRequestDto) {
        String chatRoomId = rabbitMQRequestDto.getChatRoomId();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            UserDto userDto = rabbitMQRequestDto.getUser();
            if (chatRoom.getUsers().contains(userDto)) {
                log.error("Error entering chat room: user already exists.");
            }

            chatRoom.addUser(userDto);
            chatRoomRepository.save(chatRoom);

            saveSystemChatMessage(chatRoomId, SystemMessage.ENTER, userDto.getNickname());

            addChatRoomOfChatUser(rabbitMQRequestDto.getUsername(), rabbitMQRequestDto.getChatRoomId());
        } else {
            log.error("Error entering chat room: chat room does not exist.");
        }
    }

    private void leaveChatRoom(RabbitMQRequestDto rabbitMQRequestDto) {
        String chatRoomId = rabbitMQRequestDto.getChatRoomId();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            log.debug("leave chat room");
            String username = rabbitMQRequestDto.getUsername();
            if (chatRoom.isContainedUser(username)) {
                chatRoom.removeUser(username);

                chatRoomRepository.save(chatRoom);

                saveSystemChatMessage(chatRoomId, SystemMessage.EXIT, rabbitMQRequestDto.getUserNickname());

                removeChatRoomOfChatUser(username, chatRoomId);
            }
        } else {
            log.error("Error leaving chat room: chat room does not exist.");
        }
    }

    private void addChatRoomOfChatUser(String username, String chatRoomId) {
        ChatUser chatUser = chatUserRepository.findByUsername(username);

        if (chatUser != null) {
            chatUser.addChatRoomId(chatRoomId);
            chatUserRepository.save(chatUser);
        } else {
            ChatUser newChatUser = new ChatUser(username, chatRoomId);
            chatUserRepository.save(newChatUser);
        }
    }

    private void removeChatRoomOfChatUser(String username, String chatRoomId) {
        ChatUser chatUser = chatUserRepository.findByUsername(username);

        if (chatUser != null) {
            chatUser.removeChatRoomId(chatRoomId);
            chatUserRepository.save(chatUser);
        } else {
            throw new UserHasNoChatRoomException(username);
        }
    }

    private void saveSystemChatMessage(String chatRoomId, SystemMessage systemMessage, String userNickname) {
        ChatMessage chatMessage = systemMessage.getSystemChatMessage(chatRoomId, userNickname);

        chatMessageRepository.save(chatMessage);
    }

}
