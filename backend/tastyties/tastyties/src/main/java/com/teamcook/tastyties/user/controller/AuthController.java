package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import com.teamcook.tastyties.security.jwtutil.JwtTokenProvider;
import com.teamcook.tastyties.user.dto.AuthRequestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Autowired
    public AuthController(JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager, UserDetailsService userDetailsService) {
        this.tokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<CommonResponseDTO> login(@RequestBody AuthRequestDTO authRequest) {
        log.debug(String.valueOf(authRequest));
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

            // 인증이 성공하면 JWT 토큰 생성
            String accessToken = tokenProvider.generateAccessToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(authentication);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshToken);

            // 토큰과 함께 성공 응답
            CommonResponseDTO response = new CommonResponseDTO(200, "로그인 성공", tokens);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (BadCredentialsException e) {
            // 아이디 또는 비밀번호가 틀린 경우
            CommonResponseDTO response = new CommonResponseDTO(401, "아이디 또는 비밀번호가 잘못되었습니다.", null);
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        } catch (AuthenticationException e) {
            // 기타 인증 예외 처리
            CommonResponseDTO response = new CommonResponseDTO(500, "인증 오류가 발생했습니다.", null);
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<CommonResponseDTO> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        log.debug(refreshToken);
        if (refreshToken == null || !tokenProvider.validateToken(refreshToken)) {
            CommonResponseDTO response = new CommonResponseDTO(401, "적절하지 않은 refresh token 입니다.", null);
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        try {
            String username = tokenProvider.getUsernameFromJWT(refreshToken);
            log.debug(username);

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, new ArrayList<>());
            String newAccessToken = tokenProvider.generateAccessToken(authentication);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);

            CommonResponseDTO response = new CommonResponseDTO(200, "토큰이 정상적으로 refresh 되었습니다. ", tokens);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            CommonResponseDTO response = new CommonResponseDTO(500, "토큰 refresh 중 오류가 발생했습니다.", null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<CommonResponseDTO> logout(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        // 리프레시 토큰 무효화 로직 추가 (DB에서 제거 등)
        invalidateRefreshToken(refreshToken);

        CommonResponseDTO response = new CommonResponseDTO(200, "로그아웃 성공", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private void invalidateRefreshToken(String refreshToken) {
        // 리프레시 토큰 무효화 로직
    }
}
