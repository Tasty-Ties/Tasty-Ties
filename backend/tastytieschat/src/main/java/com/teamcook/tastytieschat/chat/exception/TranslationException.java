package com.teamcook.tastytieschat.chat.exception;

public class TranslationException extends RuntimeException {

    public TranslationException() {
        super("최대 번역 시도 횟수를 초과했습니다.");
    }

}
