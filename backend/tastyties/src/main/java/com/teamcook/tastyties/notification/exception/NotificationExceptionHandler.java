package com.teamcook.tastyties.notification.exception;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.teamcook.tastyties.notification")
public class NotificationExceptionHandler {

    @ExceptionHandler(AuthenticationFailureException.class)
    public ResponseEntity<CommonResponseDto> authenticationFailureException(AuthenticationFailureException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(CommonResponseDto.builder()
                        .stateCode(401)
                        .message(e.getMessage())
                        .build());
    }

}
