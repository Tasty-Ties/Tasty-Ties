package com.teamcook.tastytieschat.common.interceptor;

import com.teamcook.tastytieschat.security.jwtutil.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class FilterChannelInterceptor implements ChannelInterceptor {

    private JwtTokenProvider tokenProvider;

    @Autowired
    public FilterChannelInterceptor(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (headerAccessor != null && headerAccessor.getCommand() == StompCommand.CONNECT) {
            String jwt = getJwtFromHeader(headerAccessor);

            if (jwt != null && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJWT(jwt);

                headerAccessor.addNativeHeader("username", username);
            }
        }

        return message;
    }

    private String getJwtFromHeader(StompHeaderAccessor headerAccessor) {
        if (headerAccessor != null && headerAccessor.getCommand() == StompCommand.CONNECT) {
            try {
                String token = headerAccessor.getNativeHeader("Authorization").get(0);

                if (token != null && token.startsWith("Bearer ")) {
                    return token.substring(7);
                }
            } catch (NullPointerException e) {
                return null;
            }
        }

        return null;
    }
}
