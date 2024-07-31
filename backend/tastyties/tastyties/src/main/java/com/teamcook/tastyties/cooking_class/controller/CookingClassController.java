package com.teamcook.tastyties.cooking_class.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassSearchCondition;
import com.teamcook.tastyties.cooking_class.dto.ReviewRequestDto;
import com.teamcook.tastyties.cooking_class.service.CookingClassService;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/classes")
@Slf4j
public class CookingClassController {

    private final CookingClassService cookingClassService;

    @Autowired
    public CookingClassController(CookingClassService cookingClassService) {
        this.cookingClassService = cookingClassService;
    }

    // 클래스 등록
    @PostMapping
    public ResponseEntity<CommonResponseDto> registerClass(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody final CookingClassDto registerDto) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.builder()
                            .stateCode(401)
                            .message("인증 오류가 발생했습니다")
                            .data(null)
                            .build());
        }
        User user = userDetails.user();
        log.debug("userId= {}", user.getUserId());

        CookingClassDto cookingClass = cookingClassService.registerClass(user, registerDto);



        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("클래스가 정상적으로 등록됐습니다.")
                        .data(cookingClass)
                        .build());
    }

    // 클래스 목록 조회
    @GetMapping
    public ResponseEntity<CommonResponseDto> getClasses(@ModelAttribute CookingClassSearchCondition searchCondition, Pageable pageable) {
        Page<CookingClassListDto> classList = cookingClassService.searchCookingClassList(searchCondition, pageable);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 목록이 반환되었습니다.")
                        .data(classList)
                        .build());
    }

    // 클래스 상세 조회
    @GetMapping("/{uuid}")
    public ResponseEntity<CommonResponseDto> getClassDetail(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String uuid) {

        CookingClassDto cookingClassDetail = cookingClassService.getCookingClassDetail(userDetails, uuid);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 조회되었습니다.")
                        .data(cookingClassDetail)
                        .build());
    }

    // 클래스 삭제
    @DeleteMapping("/{uuid}")
    public ResponseEntity<CommonResponseDto> deleteClass(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String uuid) {
        return null;
    }

    // 클래스 예약
    @PostMapping("/reservation/{uuid}")
    public ResponseEntity<CommonResponseDto> reserveClass(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String uuid) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.builder()
                            .stateCode(401)
                            .message("인증 오류가 발생했습니다")
                            .data(null)
                            .build());
        }

        cookingClassService.reserveClass(userDetails.user(), uuid);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("클래스가 예약되었습니다.")
                        .data(null)
                        .build());
    }

    // 클래스 예약 취소
    @DeleteMapping("/reservation/{uuid}")
    public ResponseEntity<CommonResponseDto> deleteReservation(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String uuid) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.builder()
                            .stateCode(401)
                            .message("인증 오류가 발생했습니다")
                            .data(null)
                            .build());
        }
        cookingClassService.deleteReservation(userDetails.user(), uuid);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(CommonResponseDto.builder()
                        .stateCode(204)
                        .message("예약이 정상적으로 취소되었습니다.")
                        .data(null)
                        .build());
    }

    // 클래스 리뷰 생성
    @PostMapping("/reviews")
    public ResponseEntity<CommonResponseDto> submitReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ReviewRequestDto reviewRequestDto) {

        return null;
    }
}
