package com.teamcook.tastyties.notification.service;

import com.google.firebase.messaging.*;
import com.teamcook.tastyties.notification.entity.FcmNotification;
import com.teamcook.tastyties.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@Slf4j
public class NotificationService {

    private final FirebaseMessaging firebaseMessaging;
    private final UserRepository userRepository;

    public NotificationService(FirebaseMessaging firebaseMessaging, UserRepository userRepository) {
        this.firebaseMessaging = firebaseMessaging;
        this.userRepository = userRepository;
    }

    public void sendMessagesTo(Set<String> fcmTokens, FcmNotification fcmNotification) {
        Notification notification = Notification.builder()
                .setTitle(fcmNotification.getTitle())
                .setBody(fcmNotification.getBody())
                .build();

        MulticastMessage messages = MulticastMessage.builder()
                .addAllTokens(fcmTokens)
                .setNotification(notification)
                .build();

        try {
            firebaseMessaging.sendEachForMulticast(messages);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send fcm notification", e);
        }
    }

}
