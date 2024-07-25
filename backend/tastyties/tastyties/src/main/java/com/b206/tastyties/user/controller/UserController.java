package com.b206.tastyties.user.controller;

import com.b206.tastyties.common.dto.CommonResponseDTO;
import com.b206.tastyties.user.dto.UserRegistrationDTO;
import com.b206.tastyties.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
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
}
