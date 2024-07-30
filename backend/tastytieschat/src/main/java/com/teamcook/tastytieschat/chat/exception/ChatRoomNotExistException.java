package com.teamcook.tastytieschat.chat.exception;

public class ChatRoomNotExistException extends RuntimeException {

    public ChatRoomNotExistException(String chatRoomId) {
        super(chatRoomId + "에 해당하는 채팅방이 존재하지 않습니다.");
    }

}
