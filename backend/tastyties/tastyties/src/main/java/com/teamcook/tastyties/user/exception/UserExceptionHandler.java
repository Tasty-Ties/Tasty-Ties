package com.teamcook.tastyties.user.exception;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.b206.tastyties.user")
public class UserExceptionHandler {

    @ExceptionHandler(UserIDAlreadyExistsException.class)
    public ResponseEntity<CommonResponseDTO> handleUserIdAlreadyExistsException(UserIDAlreadyExistsException ex) {
        CommonResponseDTO errorResponse = new CommonResponseDTO(409, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT); // 409 Conflict
    }
}
