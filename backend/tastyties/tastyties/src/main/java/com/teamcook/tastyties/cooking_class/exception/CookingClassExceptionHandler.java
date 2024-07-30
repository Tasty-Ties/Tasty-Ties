package com.teamcook.tastyties.cooking_class.exception;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import com.teamcook.tastyties.user.exception.UserIDAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.teamcook.tastyties.cooking_class")
public class CookingClassExceptionHandler {

    @ExceptionHandler(ClassIsDeletedException.class)
    public ResponseEntity<CommonResponseDTO> handleClassIsDeletedException(ClassIsDeletedException ex) {
        CommonResponseDTO errorResponse = new CommonResponseDTO(409, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT); // 409 Conflict
    }
}
