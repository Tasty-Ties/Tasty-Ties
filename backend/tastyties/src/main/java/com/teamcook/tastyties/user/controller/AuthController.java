package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.security.jwtutil.JwtTokenProvider;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.dto.AuthRequestDto;
import com.teamcook.tastyties.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public AuthController(JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService, UserService userService,
                          RedisTemplate<String, Object> redisTemplate) {
        this.tokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
        this.redisTemplate = redisTemplate;
    }

    @PostMapping("/login")
    public ResponseEntity<CommonResponseDto> login(@RequestBody AuthRequestDto authRequest) {
        log.debug(String.valueOf(authRequest));
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

            // 인증이 성공하면 JWT 토큰 생성
            String accessToken = tokenProvider.generateAccessToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(authentication);

            String username = authRequest.getUsername();
            redisTemplate.opsForValue().set("refreshToken:" + username, refreshToken,
                    tokenProvider.getRefreshTokenExpirationInMs(), TimeUnit.MILLISECONDS);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshToken);

            // FCM token이 있으면 저장
            if (authRequest.getFcmToken() != null) {
                userService.updateFCMToken(authRequest);
            }

            // 토큰과 함께 성공 응답
            return ResponseEntity.ok()
                    .body(CommonResponseDto.builder()
                            .stateCode(200)
                            .message("로그인 성공")
                            .data(tokens)
                            .build());
        } catch (BadCredentialsException e) {
            // 아이디 또는 비밀번호가 틀린 경우
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.builder()
                            .stateCode(401)
                            .message("아이디 또는 비밀번호가 잘못되었습니다.")
                            .data(null)
                            .build());
        } catch (AuthenticationException e) {
            // 기타 인증 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CommonResponseDto.builder()
                            .stateCode(500)
                            .message("인증 오류가 발생했습니다.")
                            .data(null)
                            .build());
        }
    }


    @GetMapping("/test")
    public String test() {
        System.out.println("test");
        return "test";
    }


    @PostMapping("/refresh")
    public ResponseEntity<CommonResponseDto> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        log.debug("refreshToken: {}", refreshToken);
        if (refreshToken == null || !tokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.builder()
                            .stateCode(401)
                            .message("적절하지 않은 refresh token 입니다.")
                            .data(null)
                            .build());
        }

        try {
            String username = tokenProvider.getUsernameFromJWT(refreshToken);
            log.debug(username);

            String storedRefreshToken = (String) redisTemplate.opsForValue().get("refreshToken:" + username);
            if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(CommonResponseDto.builder()
                                .stateCode(401)
                                .message("유효하지 않은 refresh token 입니다.")
                                .data(null)
                                .build());
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, new ArrayList<>());
            String newAccessToken = tokenProvider.generateAccessToken(authentication);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);

            return ResponseEntity.ok()
                    .body(CommonResponseDto.builder()
                            .stateCode(200)
                            .message("토큰이 정상적으로 refresh 되었습니다.")
                            .data(tokens)
                            .build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CommonResponseDto.builder()
                            .stateCode(500)
                            .message("토큰 refresh 중 오류가 발생했습니다.")
                            .data(null)
                            .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<CommonResponseDto> logout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        // 리프레시 토큰 무효화 로직 추가 (DB에서 제거 등)
        invalidateRefreshToken(userDetails.getUsername());
 
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("로그아웃 성공")
                        .data(null)
                        .build());
    }

    private void invalidateRefreshToken(String username) {
        // Redis에서 해당 사용자의 리프레시 토큰 삭제
        redisTemplate.delete("refreshToken:" + username);
    }
}
