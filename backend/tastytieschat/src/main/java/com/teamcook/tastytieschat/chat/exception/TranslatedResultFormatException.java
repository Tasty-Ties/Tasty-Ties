package com.teamcook.tastytieschat.chat.exception;

public class TranslatedResultFormatException extends RuntimeException {

    public TranslatedResultFormatException() {
        super("번역된 결과가 형식에 맞지 않습니다.");
    }

}
