package com.teamcook.tastyties.exception.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.exception.CookingClassIsDeletedException;
import com.teamcook.tastyties.exception.CookingClassNotFoundException;
import com.teamcook.tastyties.exception.LiveClassNotFoundException;
import com.teamcook.tastyties.exception.ReservationNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.teamcook.tastyties.cooking_class")
public class CookingClassExceptionHandler {

    @ExceptionHandler(CookingClassIsDeletedException.class)
    public ResponseEntity<CommonResponseDto> handleClassIsDeletedException(CookingClassIsDeletedException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(409, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT); // 409 Conflict
    }

    @ExceptionHandler({CookingClassNotFoundException.class, LiveClassNotFoundException.class})
    public ResponseEntity<CommonResponseDto> handleClassNotFoundException(RuntimeException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(404, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<CommonResponseDto> handleReservationNotFoundException(ReservationNotFoundException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(404, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
}
