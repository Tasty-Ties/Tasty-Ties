package com.teamcook.tastyties.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@Slf4j
public class RedisConfig {

    private final RedisConnectionFactory redisConnectionFactory;

    @Autowired
    public RedisConfig(RedisConnectionFactory redisConnectionFactory) {
        this.redisConnectionFactory = redisConnectionFactory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        // Redis 서버 연결 관리
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        // 키 직렬화 설정
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        // 값 직렬화 설정
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        // 해시 키 직렬화 설정
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        // 해시 값 직렬화 설정
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        // 기본 직렬화기 설정
        redisTemplate.setDefaultSerializer(new StringRedisSerializer());
        // 트랜잭션 지원 활성화
        redisTemplate.setEnableTransactionSupport(false);
        return redisTemplate;
    }

    @PostConstruct
    public void checkRedisConnectionFactory() {
        log.debug("RedisConnectionFactory implementation: " + redisConnectionFactory.getClass().getName());
    }
}
