package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.RabbitMQRequestDTO;
import com.teamcook.tastytieschat.common.dto.CommonResponseDTO;
import org.springframework.amqp.core.Message;

public interface RabbitMQConsumer {

    void hostChatRoom(RabbitMQRequestDTO rabbitMQRequestDto, Message message);
    void attendeeChatRoom(RabbitMQRequestDTO rabbitMQRequestDto);

}
