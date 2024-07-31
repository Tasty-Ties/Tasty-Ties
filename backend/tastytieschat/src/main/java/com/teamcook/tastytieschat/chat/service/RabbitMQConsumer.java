package com.teamcook.tastytieschat.chat.service;

import com.teamcook.tastytieschat.chat.dto.RabbitMQRequestDTO;
import com.teamcook.tastytieschat.common.dto.CommonResponseDTO;

public interface RabbitMQConsumer {

    CommonResponseDTO createChatRoom(RabbitMQRequestDTO rabbitMQRequestDto);

}
