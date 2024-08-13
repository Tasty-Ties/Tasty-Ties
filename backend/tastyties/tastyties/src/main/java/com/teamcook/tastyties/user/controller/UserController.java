package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassParticipatedListDto;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.shared.dto.ReviewResponseDto;
import com.teamcook.tastyties.user.dto.UserInfoDto;
import com.teamcook.tastyties.user.dto.UserProfileDto;
import com.teamcook.tastyties.user.dto.UserRegistrationDto;
import com.teamcook.tastyties.user.dto.UserUpdateDto;
import com.teamcook.tastyties.user.dto.reward.ActivityPointLogResponseDto;
import com.teamcook.tastyties.user.exception.UserDetailsNotFoundException;
import com.teamcook.tastyties.user.exception.UserIDAlreadyExistsException;
import com.teamcook.tastyties.user.service.UserProfileService;
import com.teamcook.tastyties.user.service.UserRewardsService;
import com.teamcook.tastyties.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserProfileService userProfileService;
    private final UserRewardsService userRewardsService;
    @Autowired
    public UserController(UserService userService, UserProfileService userProfileService, UserRewardsService userRewardsService) {
        this.userService = userService;
        this.userProfileService = userProfileService;
        this.userRewardsService = userRewardsService;
    }

    // 회원 가입
    @PostMapping()
    public ResponseEntity<CommonResponseDto> registerUser(@RequestBody UserRegistrationDto request) {
        String savedUsername = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("회원가입 성공")
                        .data(savedUsername)
                        .build());
    }

    // 유저이름 중복체크
    @GetMapping("/check-username")
    public ResponseEntity<CommonResponseDto> checkUsername(@RequestParam("username") String username) {
        if (!userService.isUserNameAvailable(username)) {
            throw new UserIDAlreadyExistsException("해당 아이디는 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("아이디 중복 체크 성공.")
                        .data(null)
                        .build());
    }

    // 닉네임 중복체크
    @GetMapping("/check-nickname")
    public ResponseEntity<CommonResponseDto> checkNickname(@RequestParam("nickname") String nickname) {
        if (!userService.isNicknameAvailable(nickname)) {
            throw new UserIDAlreadyExistsException("해당 닉네임은 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("닉네임 중복 체크 성공.")
                        .data(null)
                        .build());
    }

    // 이메일 중복체크
    @GetMapping("/check-email")
    public ResponseEntity<CommonResponseDto> checkEmail(@RequestParam("email_id") String emailId, @RequestParam("email_domain") String emailDomain) {
        if (!userService.isEmailIdAvailable(emailId, emailDomain)) {
            throw new UserIDAlreadyExistsException("해당 이메일은 이미 존재합니다.");
        }
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("이메일 중복 체크 성공.")
                        .data(null)
                        .build());
    }

    // 내 프로필 조회
    @GetMapping("/me")
    public ResponseEntity<CommonResponseDto> myProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserProfileDto myProfile = userProfileService.getMyProfile(userDetails.getUserId());
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("프로필이 정상적으로 조회됐습니다.")
                        .data(myProfile)
                        .build());
    }

    // 내 프로필 수정
    @PatchMapping("/me")
    public ResponseEntity<CommonResponseDto> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody UserUpdateDto request) {
        UserUpdateDto userUpdateDTO = userService.updateProfile(userDetails, request);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("프로필이 정상적으로 수정됐습니다.")
                        .data(userUpdateDTO)
                        .build());
    }

    // 프로필 이미지 업로드
    @PatchMapping("/me/profile-image")
    public ResponseEntity<CommonResponseDto> uploadProfileImage(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                @RequestPart MultipartFile profileImage) {
        String imageUrl = userService.uploadImage(userDetails, profileImage);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("프로필이 정상적으로 수정됐습니다.")
                        .data(imageUrl)
                        .build());
    }

    // 내 프로필 삭제
    @DeleteMapping("/me")
    public ResponseEntity<CommonResponseDto> deleteProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        userService.deleteProfile(userDetails.getUsername());
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("프로필이 정상적으로 삭제됐습니다.")
                        .data(true)
                        .build());
    }

    // 내가 예약한 클래스
    @GetMapping("/me/reservations")
    public ResponseEntity<CommonResponseDto> getMyReservations(@AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {
        if (userDetails == null) {
            throw new UserDetailsNotFoundException("인증 정보를 찾을 수 없습니다.");
        }

        Page<CookingClassListDto> reservedClasses = userProfileService.getReservedClasses(userDetails.getUserId(), pageable);

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("예약한 클래스가 정상적으로 조회되었습니다.")
                        .data(reservedClasses)
                        .build());
    }

    // 내가 강의할 클래스
    @GetMapping("/me/hosting")
    public ResponseEntity<CommonResponseDto> getHostingClass(@AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {
        if (userDetails == null) {
            throw new UserDetailsNotFoundException("인증 정보를 찾을 수 없습니다.");
        }
        Page<CookingClassListDto> hostingClasses = userProfileService.getHostingClasses(userDetails.getUserId(), pageable);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("수업할 클래스가 정상적으로 조회되었습니다.")
                        .data(hostingClasses)
                        .build());
    }

    // 내가 참여한 클래스
    @GetMapping("/me/participated")
    public ResponseEntity<CommonResponseDto> getParticipatedClass(@AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {
        if (userDetails == null) {
            throw new UserDetailsNotFoundException("인증 정보를 찾을 수 없습니다.");
        }
        Page<CookingClassParticipatedListDto> participatingClasses = userProfileService.getParticipatedClasses(userDetails.getUsername(), pageable);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("수업할 클래스가 정상적으로 조회되었습니다.")
                        .data(participatingClasses)
                        .build());
    }

    // 나의 마일리지
    @GetMapping("/me/activity-point")
    public ResponseEntity<CommonResponseDto> getActivityPointLog(@AuthenticationPrincipal CustomUserDetails userDetails, int period) {
        List<ActivityPointLogResponseDto> myActivityPointLog = userRewardsService.getMyActivityPointLog(userDetails, period);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("수업할 클래스가 정상적으로 조회되었습니다.")
                        .data(myActivityPointLog)
                        .build());
    }

    // {username}의 프로필 조회
    @GetMapping("/profile/{username}")
    public ResponseEntity<CommonResponseDto> viewUserProfile(@PathVariable String username) {
        UserInfoDto profile = userProfileService.getProfileMain(username);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message(username + "님의 클래스를 정상적으로 조회했습니다.")
                        .data(profile)
                        .build());
    }

    // {username}이 참여한 클래스 조회
    @GetMapping("/profile/{username}/participated")
    public ResponseEntity<CommonResponseDto> viewUserParticipated(@PathVariable String username, Pageable pageable) {
        Page<CookingClassParticipatedListDto> reservedClasses = userProfileService.getParticipatedClasses(username, pageable);

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("참여한 클래스가 정상적으로 조회되었습니다.")
                        .data(reservedClasses)
                        .build());
    }

    // {username}이 강의한 클래스
    @GetMapping("/profile/{username}/hosting")
    public ResponseEntity<CommonResponseDto> viewUserHosting(@PathVariable String username, Pageable pageable) {
        Page<CookingClassListDto> hostingClasses = userProfileService.getHostedClasses(username, pageable);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("강의한 클래스가 정상적으로 조회되었습니다.")
                        .data(hostingClasses)
                        .build());
    }

    // {username} 에게 달린 수강평
    @GetMapping("/profile/{username}/reviews")
    public ResponseEntity<CommonResponseDto> viewUserReview(@PathVariable String username, Pageable pageable) {
        Page<ReviewResponseDto> reviews = userProfileService.getReviews(username, pageable);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("강의한 클래스가 정상적으로 조회되었습니다.")
                        .data(reviews)
                        .build());
    }
}