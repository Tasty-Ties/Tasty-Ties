package com.teamcook.tastytieschat.common.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue.host}")
    private String hostQueue;
    @Value("${rabbitmq.queue.attendee}")
    private String attendeeQueue;
    @Value("${rabbitmq.exchange}")
    private String exchange;
    @Value("${rabbitmq.routing.key.create}")
    private String createRoutingKey;
    @Value("${rabbitmq.routing.key.delete}")
    private String deleteRoutingKey;
    @Value("${rabbitmq.routing.key.join}")
    private String joinRoutingKey;
    @Value("${rabbitmq.routing.key.leave}")
    private String leaveRoutingKey;

    @Bean
    public Queue hostQueue() {
        return new Queue(hostQueue);
    }

    @Bean
    public Queue attendeeQueue() {
        return new Queue(attendeeQueue);
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(exchange);
    }

    @Bean
    public Binding createBinding(Queue hostQueue, DirectExchange exchange) {
        return BindingBuilder.bind(hostQueue).to(exchange).with(createRoutingKey);
    }

    @Bean
    public Binding deleteBinding(Queue hostQueue, DirectExchange exchange) {
        return BindingBuilder.bind(hostQueue).to(exchange).with(deleteRoutingKey);
    }

    @Bean
    public Binding joinBinding(Queue attendeeQueue, DirectExchange exchange) {
        return BindingBuilder.bind(attendeeQueue).to(exchange).with(joinRoutingKey);
    }

    @Bean
    public Binding leaveBinding(Queue attendeeQueue, DirectExchange exchange) {
        return BindingBuilder.bind(attendeeQueue).to(exchange).with(leaveRoutingKey);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(CachingConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);
        return rabbitTemplate;
    }

}
