package com.teamcook.tastytieschat.chat.service;

import java.util.Map;

public interface ChatRoomService {
//    String createChatRoom(String title, UserDTO userDto);
//    void deleteChatRoom(String chatRoomId);
//    void enterChatRoom(String chatRoomId, UserDTO userDto);
//    String exitChatRoom(String chatRoomId, int userID);
    Map<String, Object> getUserAndTranslatedLanguages(String chatRoomId, int userId);
}
