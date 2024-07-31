package com.teamcook.tastytieschat.chat.exception;

import com.teamcook.tastytieschat.common.dto.CommonResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.teamcook.tastytieschat.chat")
public class ChatExceptionHandler {

    @ExceptionHandler({ChatRoomNotExistException.class, UserNotExistException.class})
    public ResponseEntity<CommonResponseDTO> handleChatRoomNotExistException(RuntimeException e) {
        return ResponseEntity.status(404)
                .body(CommonResponseDTO.builder()
                        .stateCode(404)
                        .message(e.getMessage())
                        .build());
    }

    @ExceptionHandler(UserAlreadyExistException.class)
    public ResponseEntity<CommonResponseDTO> handleUserAlreadyExistException(UserAlreadyExistException e) {
        return ResponseEntity.status(409)
                .body(CommonResponseDTO.builder()
                        .stateCode(409)
                        .message(e.getMessage())
                        .build());
    }

}
