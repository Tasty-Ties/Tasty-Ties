package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.RabbitMQRequestDto;
import org.springframework.amqp.core.Message;

public interface RabbitMQConsumer {

    void hostChatRoom(RabbitMQRequestDto rabbitMQRequestDto, Message message);
    void attendeeChatRoom(RabbitMQRequestDto rabbitMQRequestDto);

}
