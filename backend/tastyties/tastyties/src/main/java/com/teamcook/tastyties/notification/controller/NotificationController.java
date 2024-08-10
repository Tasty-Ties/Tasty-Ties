package com.teamcook.tastyties.notification.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.notification.dto.NotificationDto;
import com.teamcook.tastyties.notification.exception.AuthenticationFailureException;
import com.teamcook.tastyties.notification.repository.FcmNotificationRepository;
import com.teamcook.tastyties.notification.service.NotificationService;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("")
    public ResponseEntity<CommonResponseDto> getNotifications(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam Map<String, Object> requestParams) {
        if (userDetails == null) {
            throw new AuthenticationFailureException();
        }

        Map<String, Object> responseData = notificationService.getNotifications(userDetails.user(), requestParams);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("알림을 성공적으로 조회했습니다.")
                        .data(responseData)
                        .build());
    }
}
