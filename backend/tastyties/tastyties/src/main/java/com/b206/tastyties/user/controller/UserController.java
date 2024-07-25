package com.b206.tastyties.user.controller;

import com.b206.tastyties.common.dto.CommonResponseDTO;
import com.b206.tastyties.user.dto.UserRegistrationDTO;
import com.b206.tastyties.user.exception.UserIDAlreadyExistsException;
import com.b206.tastyties.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<CommonResponseDTO> registerUser(@RequestBody UserRegistrationDTO request) {
        userService.registerUser(request);

        CommonResponseDTO response = new CommonResponseDTO(201, "회원가입 성공", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/check-username")
    public ResponseEntity<CommonResponseDTO> checkUsername(@RequestParam("username") String username) {
        if (!userService.isUserNameAvailable(username)) {
            throw new UserIDAlreadyExistsException("해당 아이디는 이미 존재합니다.");
        }
        return new ResponseEntity<>(new CommonResponseDTO(200, "아이디 중복 체크 성공.", null)
                , HttpStatus.OK);
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<CommonResponseDTO> checkNickname(@RequestParam("nickname") String nickname) {
        if (!userService.isNicknameAvailable(nickname)) {
            throw new UserIDAlreadyExistsException("해당 닉네임은 이미 존재합니다.");
        }
        return new ResponseEntity<>(new CommonResponseDTO(200, "닉네임 중복 체크 성공.", null)
                , HttpStatus.OK);
    }
}
