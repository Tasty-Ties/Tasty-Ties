package com.teamcook.tastytieschat.common.exception;

public class AuthenticationFailureException extends RuntimeException {

    public AuthenticationFailureException() {
        super("인증 오류가 발생했습니다.");
    }

}
