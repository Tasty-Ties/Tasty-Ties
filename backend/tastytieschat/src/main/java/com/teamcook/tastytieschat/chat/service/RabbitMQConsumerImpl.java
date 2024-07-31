package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.RabbitMQRequestDTO;
import com.teamcook.tastytieschat.chat.dto.UserDTO;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import com.teamcook.tastytieschat.chat.exception.ChatRoomNotExistException;
import com.teamcook.tastytieschat.chat.repository.ChatRoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class RabbitMQConsumerImpl implements RabbitMQConsumer {

    private final ChatRoomRepository chatRoomRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public RabbitMQConsumerImpl(ChatRoomRepository chatRoomRepository, RabbitTemplate rabbitTemplate) {
        this.chatRoomRepository = chatRoomRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(
                    value = "${rabbitmq.queue.host}",
                    durable = "true"
            ),
            exchange = @Exchange(value = "${rabbitmq.exchange}"),
            key = "${rabbitmq.routing.key.create}"
    ))
    public void createChatRoom(RabbitMQRequestDTO rabbitMQRequestDto, Message message) {
        ChatRoom chatRoom = new ChatRoom(rabbitMQRequestDto.getTitle(), rabbitMQRequestDto.getUser());
        chatRoomRepository.save(chatRoom);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("chatRoomId", chatRoom.getId());

        String replyTo = message.getMessageProperties().getReplyTo();
        String correlationId = message.getMessageProperties().getCorrelationId();

        rabbitTemplate.convertAndSend(replyTo, responseData, msg -> {
            msg.getMessageProperties().setCorrelationId(correlationId);
            return msg;
        });
    }

    @Override
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(
                    value = "${rabbitmq.queue.host}",
                    durable = "true"
            ),
            exchange = @Exchange(value = "${rabbitmq.exchange"),
            key = "${rabbitmq.routing.key.delete}"
    ))
    public void deleteChatRoom(RabbitMQRequestDTO rabbitMQRequestDto) {
        String chatRoomId = rabbitMQRequestDto.getChatRoomId();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            chatRoomRepository.delete(chatRoom);
        } else {
            log.error("Error deleting chat room: chat room does not exist.");
        }
    }

    @Override
    public void enterChatRoom(RabbitMQRequestDTO rabbitMQRequestDto) {
        String chatRoomId = rabbitMQRequestDto.getChatRoomId();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            UserDTO userDto = rabbitMQRequestDto.getUser();
            if (chatRoom.getUsers().contains(userDto)) {
                log.error("Error entering chat room: user already exists.");
            }

            chatRoom.getUsers().add(userDto);
            chatRoomRepository.save(chatRoom);
        } else {
            log.error("Error entering chat room: chat room does not exist.");
        }
    }

    @Override
    public void leaveChatRoom(RabbitMQRequestDTO rabbitMQRequestDto) {
        String chatRoomId = rabbitMQRequestDto.getChatRoomId();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);

        if (chatRoom != null) {
            int userId = rabbitMQRequestDto.getUser().getId();
            if (chatRoom.isContainedUser(userId)) {
                String removedUserNickname = chatRoom.removeUser(userId);

                chatRoomRepository.save(chatRoom);
            }
        } else {
            log.error("Error leaving chat room: chat room does not exist.");
        }
    }

}
