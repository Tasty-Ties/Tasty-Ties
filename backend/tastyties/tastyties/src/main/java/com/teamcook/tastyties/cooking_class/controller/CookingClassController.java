package com.teamcook.tastyties.cooking_class.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import com.teamcook.tastyties.cooking_class.dto.CookingClassRegisterDto;
import com.teamcook.tastyties.cooking_class.service.CookingClassService;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/classes")
public class CookingClassController {

    private static final Logger log = LoggerFactory.getLogger(CookingClassController.class);
    private final CookingClassService ccService;

    @Autowired
    public CookingClassController(CookingClassService ccService) {
        this.ccService = ccService;
    }

    @PostMapping
    public ResponseEntity<CommonResponseDTO> registerClass(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                           @RequestBody final CookingClassRegisterDto registerDto) {
        User user = userDetails.getUser();
        log.debug("userId= {}", user.getUserId());

        ccService.registerClass(user, registerDto);
        return null;
    }
}
