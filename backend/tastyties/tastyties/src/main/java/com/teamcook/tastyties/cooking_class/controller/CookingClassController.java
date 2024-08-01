package com.teamcook.tastyties.cooking_class.controller;

import com.teamcook.tastyties.chat.dto.ChatUserDto;
import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.common.dto.RabbitMQRequestDto;
import com.teamcook.tastyties.common.dto.RabbitMQUserDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassSearchCondition;
import com.teamcook.tastyties.cooking_class.dto.ReviewRequestDto;
import com.teamcook.tastyties.common.constant.RabbitMQRequestType;
import com.teamcook.tastyties.cooking_class.service.CookingClassService;
import com.teamcook.tastyties.cooking_class.service.RabbitMQProducer;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.exception.UserDetailsNotFoundException;
import com.teamcook.tastyties.user.service.UserChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/classes")
@Slf4j
public class CookingClassController {

    private final UserChatService userChatService;
    private final CookingClassService cookingClassService;
    private final RabbitMQProducer rabbitMQProducer;

    @Autowired
    public CookingClassController(UserChatService userChatService, CookingClassService cookingClassService, RabbitMQProducer rabbitMQProducer) {
        this.userChatService = userChatService;
        this.cookingClassService = cookingClassService;
        this.rabbitMQProducer = rabbitMQProducer;
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

        ChatUserDto chatUser = userChatService.getUser(user.getUserId());

        RabbitMQRequestDto rabbitMQRequestDto = RabbitMQRequestDto.builder()
                .type(RabbitMQRequestType.CREATE)
                .title(cookingClass.getTitle())
                .user(RabbitMQUserDto.builder()
                        .id(chatUser.getId())
                        .nickname(chatUser.getNickname())
                        .language(chatUser.getLanguage())
                        .build())
                .build();
        Map<String, String> response = rabbitMQProducer.sendAndReceive(rabbitMQRequestDto);

        // TODO: 쿠킹 클래스에 채팅방 ID 저장하기
        log.debug("Success creating chat room: " + response.get("chatRoomId"));

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
        log.debug("localfilter {} ", searchCondition.isUseLocalFilter());
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
        if (userDetails == null) {
            throw new UserDetailsNotFoundException("인증 정보를 찾을 수 없습니다.");
        }
        long row = cookingClassService.deleteClass(userDetails.getUserId(), uuid);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 삭제되었습니다.")
                        .data("연관된 예약 " + row + "개가 취소되었습니다.")
                        .build());
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
        cookingClassService.saveReview(userDetails, reviewRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("리뷰가 작성되었습니다.")
                        .data(reviewRequestDto)
                        .build());
    }
}
