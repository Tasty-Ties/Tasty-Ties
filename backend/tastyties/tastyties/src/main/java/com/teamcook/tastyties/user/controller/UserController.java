package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.dto.UserProfileDTO;
import com.teamcook.tastyties.user.dto.UserRegistrationDTO;
import com.teamcook.tastyties.user.dto.UserUpdateDTO;
import com.teamcook.tastyties.user.exception.UserDetailsNotFoundException;
import com.teamcook.tastyties.user.exception.UserIDAlreadyExistsException;
import com.teamcook.tastyties.user.service.UserProfileService;
import com.teamcook.tastyties.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserProfileService userProfileService;
    @Autowired
    public UserController(UserService userService, UserProfileService userProfileService) {
        this.userService = userService;
        this.userProfileService = userProfileService;
    }

    @PostMapping()
    public ResponseEntity<CommonResponseDTO> registerUser(@RequestBody UserRegistrationDTO request) {
        String savedUsername = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDTO.builder()
                        .stateCode(201)
                        .message("회원가입 성공")
                        .data(savedUsername)
                        .build());
    }

    @GetMapping("/check-username")
    public ResponseEntity<CommonResponseDTO> checkUsername(@RequestParam("username") String username) {
        if (!userService.isUserNameAvailable(username)) {
            throw new UserIDAlreadyExistsException("해당 아이디는 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("아이디 중복 체크 성공.")
                        .data(null)
                        .build());
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<CommonResponseDTO> checkNickname(@RequestParam("nickname") String nickname) {
        if (!userService.isNicknameAvailable(nickname)) {
            throw new UserIDAlreadyExistsException("해당 닉네임은 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("닉네임 중복 체크 성공.")
                        .data(null)
                        .build());
    }

    @GetMapping("/check-email")
    public ResponseEntity<CommonResponseDTO> checkEmail(@RequestParam("email_id") String emailId, @RequestParam("email_domain") String emailDomain) {
        if (!userService.isEmailIdAvailable(emailId, emailDomain)) {
            throw new UserIDAlreadyExistsException("해당 이메일은 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("이메일 중복 체크 성공.")
                        .data(null)
                        .build());
    }

    @GetMapping("/me")
    public ResponseEntity<CommonResponseDTO> myProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserProfileDTO myProfile = userProfileService.getMyProfile(userDetails.getUserId());
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("프로필이 정상적으로 조회됐습니다.")
                        .data(myProfile)
                        .build());
    }

    @PatchMapping("/me")
    public ResponseEntity<CommonResponseDTO> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody UserUpdateDTO request) {
        UserUpdateDTO userUpdateDTO = userService.updateProfile(userDetails, request);
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("프로필이 정상적으로 수정됐습니다.")
                        .data(userUpdateDTO)
                        .build());
    }

    @DeleteMapping("/me")
    public ResponseEntity<CommonResponseDTO> deleteProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        userService.deleteProfile(userDetails.getUsername());
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("프로필이 정상적으로 삭제됐습니다.")
                        .data(true)
                        .build());
    }

    @GetMapping("/me/reservations")
    public ResponseEntity<CommonResponseDTO> getMyReservations(@AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {
        if (userDetails == null) {
            throw new UserDetailsNotFoundException("인증 정보를 찾을 수 없습니다.");
        }

        Page<CookingClassListDto> reservedClasses = userProfileService.getReservedClasses(userDetails.getUserId(), pageable);

        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("예약한 클래스가 정상적으로 조회되었습니다.")
                        .data(reservedClasses)
                        .build());
    }

    @GetMapping("/me/hosting")
    public ResponseEntity<CommonResponseDTO> getHostingClass(@AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {
        if (userDetails == null) {
            throw new UserDetailsNotFoundException("인증 정보를 찾을 수 없습니다.");
        }
        Page<CookingClassListDto> hostingClasses = userProfileService.getHostingClasses(userDetails.getUserId(), pageable);
        return ResponseEntity.ok()
                .body(CommonResponseDTO.builder()
                        .stateCode(200)
                        .message("수업할 클래스가 정상적으로 조회되었습니다.")
                        .data(hostingClasses)
                        .build());
    }
}