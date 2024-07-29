package com.teamcook.tastyties.cooking_class.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassRegisterDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassSearchCondition;
import com.teamcook.tastyties.cooking_class.service.CookingClassService;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/classes")
public class CookingClassController {

    private static final Logger log = LoggerFactory.getLogger(CookingClassController.class);
    private final CookingClassService ccService;
    private final CookingClassService cookingClassService;

    @Autowired
    public CookingClassController(CookingClassService ccService, CookingClassService cookingClassService) {
        this.ccService = ccService;
        this.cookingClassService = cookingClassService;
    }

    @PostMapping
    public ResponseEntity<CommonResponseDTO> registerClass(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                           @RequestBody final CookingClassRegisterDto registerDto) {
        if (userDetails == null) {
            return new ResponseEntity<>(new CommonResponseDTO(401, "인증 오류가 발생했습니다", null), HttpStatus.UNAUTHORIZED);
        }
        User user = userDetails.user();
        log.debug("userId= {}", user.getUserId());

        CookingClassRegisterDto cookingClass = ccService.registerClass(user, registerDto);
        return new ResponseEntity<>(new CommonResponseDTO(201, "클래스가 정상적으로 등록됐습니다.", cookingClass)
                , HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<CommonResponseDTO> getClasses(@ModelAttribute CookingClassSearchCondition searchCondition, Pageable pageable) {
        Page<CookingClassListDto> classList = cookingClassService.searchCookingClassList(searchCondition, pageable);
        return new ResponseEntity<>(new CommonResponseDTO(200, "정상적으로 목록이 반환되었습니다.", classList), HttpStatus.OK);
    }
}
