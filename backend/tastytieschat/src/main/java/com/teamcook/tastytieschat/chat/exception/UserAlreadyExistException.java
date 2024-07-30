package com.teamcook.tastytieschat.chat.exception;

public class UserAlreadyExistException extends RuntimeException {

    public UserAlreadyExistException(int userId) {
        super("'" + userId + "'은(는) 이미 채팅방에 초대되어 있습니다.");
    }

}
