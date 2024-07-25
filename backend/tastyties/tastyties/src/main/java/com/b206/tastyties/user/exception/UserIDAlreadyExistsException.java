package com.b206.tastyties.user.exception;

public class UserIDAlreadyExistsException extends RuntimeException {

    public UserIDAlreadyExistsException(String message) {
        super(message);
    }

    public UserIDAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
