package com.teamcook.tastytieschat.chat.service;

import java.util.Map;

public interface ChatRoomService {
    Map<String, Object> getUserAndTranslatedLanguages(String chatRoomId, int userId);
}
