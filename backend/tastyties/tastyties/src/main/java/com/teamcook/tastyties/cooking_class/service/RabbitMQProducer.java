package com.teamcook.tastyties.cooking_class.service;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.cooking_class.constant.RabbitMQRequestType;
import com.teamcook.tastyties.cooking_class.dto.RabbitMQRequestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class RabbitMQProducer {

    private final RabbitTemplate rabbitTemplate;
    private final String exchange;
    private final Map<String, String> routingKeys;

    public RabbitMQProducer(RabbitTemplate rabbitTemplate,
                            @Value("${rabbitmq.exchange}") String exchange,
                            @Value("${rabbitmq.routing.key.create}") String createKey,
                            @Value("${rabbitmq.routing.key.delete}") String deleteKey,
                            @Value("${rabbitmq.routing.key.join}") String joinKey,
                            @Value("${rabbitmq.routing.key.leave}") String leaveKey) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchange = exchange;
        this.routingKeys = Map.of(
                RabbitMQRequestType.CREATE.getType(), createKey,
                RabbitMQRequestType.DELETE.getType(), deleteKey,
                RabbitMQRequestType.JOIN.getType(), joinKey,
                RabbitMQRequestType.LEAVE.getType(), leaveKey
        );
    }

    public void send(RabbitMQRequestDTO rabbitMQRequestDTO) {
        RabbitMQRequestType type = rabbitMQRequestDTO.getType();
        rabbitTemplate.convertAndSend(exchange, routingKeys.get(type.getType()), rabbitMQRequestDTO);
    }

    public Map<String, String> sendAndReceive(RabbitMQRequestDTO rabbitMQRequestDto) {
        RabbitMQRequestType type = rabbitMQRequestDto.getType();

        MessagePostProcessor messagePostProcessor = message -> {
            message.getMessageProperties().setCorrelationId(UUID.randomUUID().toString());
            return message;
        };

        Map<String, String> response = (HashMap) rabbitTemplate.convertSendAndReceive(exchange, routingKeys.get(type.getType()), rabbitMQRequestDto, messagePostProcessor);

        return response;
    }

}
