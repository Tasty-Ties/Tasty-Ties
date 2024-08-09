package com.teamcook.tastytieschat.common.exception;

import com.teamcook.tastytieschat.common.dto.CommonResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.teamcook.tastytieschat.chat")
public class CommonExceptionHandler {

    @ExceptionHandler(AuthenticationFailureException.class)
    public ResponseEntity<CommonResponseDTO> handleAuthenticationFailure(AuthenticationFailureException e) {
        return ResponseEntity.status(401)
                .body(CommonResponseDTO.builder()
                        .stateCode(401)
                        .message(e.getMessage())
                        .build());
    }

}
