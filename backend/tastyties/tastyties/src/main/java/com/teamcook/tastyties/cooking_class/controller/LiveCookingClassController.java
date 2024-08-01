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

    @PostMapping("/create/{uuid}")
    public ResponseEntity<CommonResponseDto> initializeSession(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String uuid)
            throws OpenViduJavaClientException, OpenViduHttpException, AccessDeniedException {
        String sessionId = liveCookingClassService.getLiveSessionId(userDetails.getUserId(), uuid);
        liveCookingClassService.updateCookingClassSessionId(userDetails.getUserId(), sessionId);

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("정상적으로 조회되었습니다.")
                        .data(sessionId)
                        .build());
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
//        System.out.println("sessionId = " + sessionId);
//        System.out.println("커넥션 생성");
//        Session session = openvidu.getActiveSession(sessionId);
//        if (session == null) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
//        Connection connection = session.createConnection(properties);
//        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
        return null;
    }

}
