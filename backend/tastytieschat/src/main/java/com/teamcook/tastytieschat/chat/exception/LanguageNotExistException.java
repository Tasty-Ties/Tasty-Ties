package com.teamcook.tastytieschat.chat.exception;

public class LanguageNotExistException extends RuntimeException {

    public LanguageNotExistException() {
        super("번역된 언어가 포함되지 않았거나 잘못 표기되었습니다.");
    }

}
