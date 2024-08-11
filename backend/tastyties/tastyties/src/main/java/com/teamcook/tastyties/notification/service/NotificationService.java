package com.teamcook.tastyties.notification.service;

import com.google.firebase.messaging.*;
import com.teamcook.tastyties.notification.dto.FcmNotificationDto;
import com.teamcook.tastyties.notification.dto.NotificationDto;
import com.teamcook.tastyties.notification.entity.FcmNotification;
import com.teamcook.tastyties.notification.repository.FcmNotificationRepository;
import com.teamcook.tastyties.user.dto.UserFcmTokenDto;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
public class NotificationService {

    private final FirebaseMessaging firebaseMessaging;
    private final FcmNotificationRepository fcmNotificationRepository;
    private final UserRepository userRepository;

    private final int NOTIFICATION_DAY = 15;
    private final int NOTIFICATION_SIZE = 20;

    public NotificationService(FirebaseMessaging firebaseMessaging, FcmNotificationRepository fcmNotificationRepository, UserRepository userRepository) {
        this.firebaseMessaging = firebaseMessaging;
        this.fcmNotificationRepository = fcmNotificationRepository;
        this.userRepository = userRepository;
    }

    public void sendMessageTo(UserFcmTokenDto user, FcmNotificationDto fcmNotification) {
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

    public void sendMessagesTo(Set<UserFcmTokenDto> users, FcmNotificationDto fcmNotification) {
        Notification notification = createNotification(fcmNotification);

        Set<String> fcmTokens = getFcmTokens(users);
        if (fcmTokens.isEmpty()) {
            return;
        }

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

    private Set<String> getFcmTokens(Set<UserFcmTokenDto> users) {
        Set<String> fcmTokens = new HashSet<>();
        for (UserFcmTokenDto user : users) {
            fcmTokens.add(user.getFcmToken());
        }
        fcmTokens.remove(null);
        return fcmTokens;
    }

    private Set<Integer> getUserIds(Set<UserFcmTokenDto> users) {
        Set<Integer> userIds = new HashSet<>();
        for (UserFcmTokenDto user : users) {
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

    public Map<String, Object> getNotifications(User user, Map<String, Object> requestParams) {
        Map<String, Object> result = new HashMap<>();

        int pgNo = requestParams.get("pgNo") == null ? 0 : Integer.parseInt(requestParams.get("pgNo").toString());

        List<NotificationDto> notifications = getNotifications(user, pgNo);

        result.put("pgNo", pgNo);
        result.put("notifications", notifications);

        return result;
    }

    private List<NotificationDto> getNotifications(User user, int pgNo) {
        LocalDateTime startTime = LocalDateTime.now().minusDays(NOTIFICATION_DAY);
        Pageable pageable = PageRequest.of(pgNo, NOTIFICATION_SIZE);

        List<FcmNotification> fcmNotifications = fcmNotificationRepository.findRecentNotifications(user, startTime, pageable).getContent();

        List<NotificationDto> notificationDtos = new ArrayList<>();
        for (FcmNotification fcmNotification : fcmNotifications) {
            notificationDtos.add(new NotificationDto(fcmNotification));
        }

        return notificationDtos;
    }

    @Transactional
    public void checkReadNotifications(User user, Map<String, Object> requestParams) {
        List<Integer> notificationIds = (List<Integer>) requestParams.get("notificationIds");

        if (!notificationIds.isEmpty()) {
            fcmNotificationRepository.checkReadNotification(user, notificationIds);
        }
    }

    @Transactional
    public void deleteNotifications(User user, Map<String, Object> requestParams) {
        String notificationId = (String) requestParams.get("notificationIds");
        List<Integer> notificationIds = Stream.of(notificationId.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        if (!notificationIds.isEmpty()) {
            fcmNotificationRepository.deleteNotification(user, notificationIds);
        }
    }

}
