package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.RabbitMQRequestDTO;
import com.teamcook.tastytieschat.chat.entity.ChatRoom;
import com.teamcook.tastytieschat.chat.repository.ChatRoomRepository;
import com.teamcook.tastytieschat.common.dto.CommonResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class RabbitMQConsumerImpl implements RabbitMQConsumer {

    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public RabbitMQConsumerImpl(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
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
    public CommonResponseDTO createChatRoom(RabbitMQRequestDTO rabbitMQRequestDto) {
        ChatRoom chatRoom = new ChatRoom(rabbitMQRequestDto.getTitle(), rabbitMQRequestDto.getUser());
        chatRoomRepository.save(chatRoom);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("chatRoomId", chatRoom.getId());

        return CommonResponseDTO.builder()
                .stateCode(201)
                .message("채팅방이 정상적으로 생성됐습니다.")
                .data(responseData)
                .build();
    }

}
