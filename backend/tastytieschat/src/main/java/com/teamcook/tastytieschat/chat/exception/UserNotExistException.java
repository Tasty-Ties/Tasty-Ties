package com.teamcook.tastytieschat.chat.exception;

public class UserNotExistException extends RuntimeException {

    public UserNotExistException(String username) {
        super("'" + username + "'은(는) 해당 채팅방에 존재하지 않습니다.");
    }

}
