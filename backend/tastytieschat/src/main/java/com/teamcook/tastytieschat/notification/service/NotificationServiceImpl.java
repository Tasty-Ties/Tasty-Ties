package com.teamcook.tastytieschat.notification.service;

import com.google.firebase.messaging.*;
import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.chat.entity.ChatUser;
import com.teamcook.tastytieschat.chat.repository.ChatUserRepository;
import com.teamcook.tastytieschat.notification.dto.FcmNotificationDto;
import com.teamcook.tastytieschat.notification.entity.FcmNotification;
import com.teamcook.tastytieschat.notification.repository.FcmNotificationRepository;
import com.teamcook.tastytieschat.user.entity.User;
import com.teamcook.tastytieschat.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final FirebaseMessaging firebaseMessaging;
    private final FcmNotificationRepository fcmNotificationRepository;
    private final UserRepository userRepository;
    private final ChatUserRepository chatUserRepository;

    public NotificationServiceImpl(FirebaseMessaging firebaseMessaging, FcmNotificationRepository fcmNotificationRepository, UserRepository userRepository, ChatUserRepository chatUserRepository) {
        this.firebaseMessaging = firebaseMessaging;
        this.fcmNotificationRepository = fcmNotificationRepository;
        this.userRepository = userRepository;
        this.chatUserRepository = chatUserRepository;
    }

    @Override
    public void sendMessage(Set<UserDto> listeners, FcmNotificationDto fcmNotification) {
        if (listeners.isEmpty()) {
            return;
        }

        Set<User> users = getUserFcmTokens(listeners);
        int size = users.size();

        if (size == 1) {
            sendMessageTo(users.iterator().next(), fcmNotification);
        } else if (size > 1) {
            sendMessagesTo(users, fcmNotification);
        }
    }

    private Set<User> getUserFcmTokens(Set<UserDto> listeners) {
        List<String> usernames = new ArrayList<>();
        for (UserDto userDto : listeners) {
            usernames.add(userDto.getUsername());
        }

        Set<User> users = new HashSet<>(userRepository.findFcmTokensByUsernames(usernames));
        Set<ChatUser> chatUsers = chatUserRepository.findByUsernameInAndIsActiveTrue(usernames);

        users.removeIf(user -> {
            for (ChatUser chatUser : chatUsers) {
                if (chatUser.isEqualsWithUser(user)) {
                    return true;
                }
            }

            return false;
        });

        return users;
    }

    private void sendMessageTo(User user, FcmNotificationDto fcmNotification) {
        Notification notification = createNotification(fcmNotification);

        Message message = Message.builder()
                .setToken(user.getFcmToken())
                .setNotification(notification)
                .build();

        try {
            firebaseMessaging.send(message);

            saveMessage(fcmNotification);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send fcm notification", e);
        }
    }

    private Notification createNotification(FcmNotificationDto fcmNotificationDto) {
        return Notification.builder()
                .setTitle(fcmNotificationDto.getTitle())
                .setBody(fcmNotificationDto.getBody())
                .build();
    }

    private void saveMessage(FcmNotificationDto fcmNotification) {
        User user = userRepository.findById(fcmNotification.getUserId()).orElse(null);

        if (user != null) {
            fcmNotificationRepository.save(FcmNotification.builder()
                    .user(user)
                    .title(fcmNotification.getTitle())
                    .body(fcmNotification.getBody())
                    .build());
        }
    }

    private void sendMessagesTo(Set<User> users, FcmNotificationDto fcmNotification) {
        Notification notification = createNotification(fcmNotification);

        MulticastMessage messages = MulticastMessage.builder()
                .addAllTokens(getFcmTokens(users))
                .setNotification(notification)
                .build();

        try {
            firebaseMessaging.sendEachForMulticast(messages);

            saveMessages(getUserIds(users), fcmNotification);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send fcm notification", e);
        }
    }

    private Set<String> getFcmTokens(Set<User> users) {
        Set<String> fcmTokens = new HashSet<>();
        for (User user : users) {
            fcmTokens.add(user.getFcmToken());
        }
        fcmTokens.remove(null);
        return fcmTokens;
    }

    private Set<Integer> getUserIds(Set<User> users) {
        Set<Integer> userIds = new HashSet<>();
        for (User user : users) {
            userIds.add(user.getUserId());
        }
        return userIds;
    }

    private void saveMessages(Set<Integer> userIds, FcmNotificationDto fcmNotification) {
        List<FcmNotification> notifications = new ArrayList<>();
        for (Integer userId : userIds) {
            User user = userRepository.findById(userId).orElse(null);

            if (user != null) {
                notifications.add(FcmNotification.builder()
                        .user(user)
                        .title(fcmNotification.getTitle())
                        .body(fcmNotification.getBody())
                        .build());
            }
        }

        if (!notifications.isEmpty()) {
            fcmNotificationRepository.saveAll(notifications);
        }
    }
}
