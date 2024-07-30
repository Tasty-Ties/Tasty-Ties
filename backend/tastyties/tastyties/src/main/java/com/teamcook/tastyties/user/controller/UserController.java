package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import com.teamcook.tastyties.user.dto.UserRegistrationDTO;
import com.teamcook.tastyties.user.exception.UserIDAlreadyExistsException;
import com.teamcook.tastyties.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping()
    public ResponseEntity<CommonResponseDTO> registerUser(@RequestBody UserRegistrationDTO request) {
        String savedUsername = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDTO.builder()
                        .stateCode(201)
                        .message("회원가입 성공")
                        .data(savedUsername)
                        .build());
    }

    @GetMapping("/check-username")
    public ResponseEntity<CommonResponseDTO> checkUsername(@RequestParam("username") String username) {
        if (!userService.isUserNameAvailable(username)) {
            throw new UserIDAlreadyExistsException("해당 아이디는 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("아이디 중복 체크 성공.")
                        .data(null)
                        .build());
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<CommonResponseDTO> checkNickname(@RequestParam("nickname") String nickname) {
        if (!userService.isNicknameAvailable(nickname)) {
            throw new UserIDAlreadyExistsException("해당 닉네임은 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("닉네임 중복 체크 성공.")
                        .data(null)
                        .build());
    }

    @GetMapping("/check-email")
    public ResponseEntity<CommonResponseDTO> checkEmail(@RequestParam("email_id") String emailId, @RequestParam("email_domain") String emailDomain) {
        if (!userService.isEmailIdAvailable(emailId, emailDomain)) {
            throw new UserIDAlreadyExistsException("해당 이메일은 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("이메일 중복 체크 성공.")
                        .data(null)
                        .build());
    }
}