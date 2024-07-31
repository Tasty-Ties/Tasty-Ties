package com.teamcook.tastyties.user.exception;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.teamcook.tastyties.user")
public class UserExceptionHandler {

    @ExceptionHandler(UserIDAlreadyExistsException.class)
    public ResponseEntity<CommonResponseDTO> handleUserIdAlreadyExistsException(UserIDAlreadyExistsException ex) {
        CommonResponseDTO errorResponse = new CommonResponseDTO(409, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT); // 409 Conflict
    }

    @ExceptionHandler(CountryNotFoundException.class)
    public ResponseEntity<CommonResponseDTO> handleCountryNotFoundException(CountryNotFoundException ex) {
        CommonResponseDTO errorResponse = new CommonResponseDTO(404, ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(UserDetailsNotFoundException.class)
    public ResponseEntity<CommonResponseDTO> handleUserDetailsNotFoundException(UserDetailsNotFoundException ex) {
        CommonResponseDTO response = CommonResponseDTO.builder()
                .stateCode(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
}
