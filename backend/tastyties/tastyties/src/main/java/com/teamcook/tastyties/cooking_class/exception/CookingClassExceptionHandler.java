package com.teamcook.tastyties.cooking_class.exception;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.teamcook.tastyties.cooking_class")
public class CookingClassExceptionHandler {

    @ExceptionHandler(ClassIsDeletedException.class)
    public ResponseEntity<CommonResponseDto> handleClassIsDeletedException(ClassIsDeletedException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(409, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT); // 409 Conflict
    }

    @ExceptionHandler(ClassNotFoundException.class)
    public ResponseEntity<CommonResponseDto> handleClassNotFoundException(ClassNotFoundException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(404, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND); // 409 Conflict
    }

    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<CommonResponseDto> handleReservationNotFoundException(ReservationNotFoundException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(404, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
}
