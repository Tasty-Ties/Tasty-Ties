package com.teamcook.tastyties.cooking_class.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.cooking_class.service.LiveCookingClassService;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.Map;

@RestController
@RequestMapping("/classes/live")
public class LiveCookingClassController {

    private final LiveCookingClassService liveCookingClassService;

    @Autowired
    public LiveCookingClassController(LiveCookingClassService liveCookingClassService) {
        this.liveCookingClassService = liveCookingClassService;
    }

    @PostMapping("/sessions/{uuid}")
    public ResponseEntity<CommonResponseDto> initializeSession(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String uuid)
            throws OpenViduJavaClientException, OpenViduHttpException, AccessDeniedException {
        String sessionId = liveCookingClassService.createAndAssignLiveSession(userDetails.getUserId(), uuid);
        liveCookingClassService.updateSessionIdByCookingClassId(sessionId, uuid);

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("정상적으로 조회되었습니다.")
                        .data(sessionId)
                        .build());
    }

    @GetMapping("/sessions/{uuid}")
    public ResponseEntity<CommonResponseDto> joinSession(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String uuid) throws AccessDeniedException {
        String sessionId = liveCookingClassService.getLiveSessionIdForGuest(userDetails.getUserId(), uuid);

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 조회되었습니다.")
                        .data(sessionId)
                        .build());
    }

    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<CommonResponseDto> createConnection(@PathVariable("sessionId") String sessionId,
                                                              @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        String token = liveCookingClassService.createConnectionToken(sessionId, params);

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 조회되었습니다.")
                        .data(token)
                        .build());
    }

}
