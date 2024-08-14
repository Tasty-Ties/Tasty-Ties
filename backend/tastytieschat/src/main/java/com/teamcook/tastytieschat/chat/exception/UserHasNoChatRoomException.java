package com.teamcook.tastytieschat.chat.exception;

public class UserHasNoChatRoomException extends RuntimeException {

    public UserHasNoChatRoomException(String username) {
        super("'" + username + "'(이)가 참여하고 있는 채팅방이 존재하지 않습니다.");
    }

}
