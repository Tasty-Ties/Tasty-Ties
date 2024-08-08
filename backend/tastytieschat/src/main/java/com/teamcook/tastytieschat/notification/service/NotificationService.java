package com.teamcook.tastytieschat.notification.service;

import com.teamcook.tastytieschat.chat.dto.UserDto;
import com.teamcook.tastytieschat.notification.dto.FcmNotificationDto;

import java.util.Set;

public interface NotificationService {
    void sendMessage(Set<UserDto> listeners, FcmNotificationDto notification);
}
