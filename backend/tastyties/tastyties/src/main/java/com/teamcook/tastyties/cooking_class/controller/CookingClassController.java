package com.teamcook.tastyties.cooking_class.controller;

import com.teamcook.tastyties.common.constant.RabbitMQUserType;
import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.common.dto.RabbitMQRequestDto;
import com.teamcook.tastyties.common.dto.RabbitMQUserDto;
import com.teamcook.tastyties.cooking_class.dto.*;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassSearchCondition;
import com.teamcook.tastyties.notification.constant.NotificationType;
import com.teamcook.tastyties.notification.dto.FcmNotificationDto;
import com.teamcook.tastyties.notification.service.NotificationService;
import com.teamcook.tastyties.shared.dto.ReviewRequestDto;
import com.teamcook.tastyties.common.constant.RabbitMQRequestType;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.service.CookingClassService;
import com.teamcook.tastyties.cooking_class.service.RabbitMQProducer;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.shared.dto.ReviewResponseDto;
import com.teamcook.tastyties.user.dto.UserFcmTokenDto;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.exception.UserDetailsNotFoundException;
import com.teamcook.tastyties.user.service.UserChatService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/classes")
@Slf4j
public class CookingClassController {

    private final UserChatService userChatService;
    private final CookingClassService cookingClassService;
    private final NotificationService notificationService;
    private final RabbitMQProducer rabbitMQProducer;

    @Autowired
    public CookingClassController(UserChatService userChatService, CookingClassService cookingClassService, NotificationService notificationService, RabbitMQProducer rabbitMQProducer) {
        this.userChatService = userChatService;
        this.cookingClassService = cookingClassService;
        this.notificationService = notificationService;
        this.rabbitMQProducer = rabbitMQProducer;
    }

    // 클래스 등록
    @PostMapping
    public ResponseEntity<CommonResponseDto> registerClass(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                           @RequestPart("registerDto")@Valid CookingClassRegisterDto registerDto,
                                                           @RequestPart("images") List<MultipartFile> images) {
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
        log.debug("tag: {}", registerDto.getCookingClassTags());
        log.debug("recipes: {}", registerDto.getRecipe());
        log.debug("images: {}", images.size());

        CookingClass cookingClass = cookingClassService.registerClass(user, registerDto, images);

        log.debug("cookingClassId= {}", cookingClass.getUuid());
        log.debug("cookingClassTitle= {}", cookingClass.getTitle());

        // TODO: 쿠킹 클래스에 채팅방 ID 저장하기
        createChatRoom(cookingClass, user.getUsername());
        registerDto.setChatRoomId(cookingClass.getChatRoomId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("클래스가 정상적으로 등록됐습니다.")
                        .data(registerDto)
                        .build());
    }

    private void createChatRoom(CookingClass cookingClass, String username) {
        ChatUserDto chatUser = userChatService.getUser(username);

        RabbitMQRequestDto rabbitMQRequestDto = RabbitMQRequestDto.builder()
                .type(RabbitMQRequestType.CREATE)
                .title(cookingClass.getTitle())
                .user(RabbitMQUserDto.builder()
                        .type(RabbitMQUserType.HOST)
                        .username(chatUser.getUsername())
                        .nickname(chatUser.getNickname())
                        .language(chatUser.getLanguage())
                        .build())
                .imageUrl(cookingClass.getMainImage())
                .build();
        Map<String, String> response = rabbitMQProducer.sendAndReceive(rabbitMQRequestDto);

        cookingClass.setChatRoomId(response.get("chatRoomId"));

        cookingClassService.saveCookingClassWithChatRoomId(cookingClass);
    }

    // 클래스 목록 조회
    @GetMapping
    public ResponseEntity<CommonResponseDto> getClasses(@ModelAttribute CookingClassSearchCondition searchCondition, Pageable pageable) {
        log.debug("localfilter {} ", searchCondition.isUseLocalFilter());
        log.debug("countryCode {} ", searchCondition.getCountryCode());
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

    @GetMapping("/{uuid}/reviews")
    public ResponseEntity<CommonResponseDto> getClassDetailReviews(@PathVariable String uuid, Pageable pageable) {
        Page<ReviewResponseDto> reviewResponseDto = cookingClassService.getReviewResponseDto(uuid, pageable);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 리뷰가 조회되었습니다.")
                        .data(reviewResponseDto)
                        .build());
    }

    // 클래스 삭제
    @DeleteMapping("/{uuid}")
    public ResponseEntity<CommonResponseDto> deleteClass(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String uuid) {
        if (userDetails == null) {
            throw new UserDetailsNotFoundException("인증 정보를 찾을 수 없습니다.");
        }

        DeletedCookingClassDto deletedCookingClass = cookingClassService.deleteClass(userDetails.getUserId(), uuid);

        deleteChatRoom(deletedCookingClass.getChatRoomId());

        sendDeletionCookingClassNotification(deletedCookingClass.getClassName(), deletedCookingClass.getUsers());

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 삭제되었습니다.")
                        .data("연관된 예약 " + deletedCookingClass.getDeletedReservationCount() + "개가 취소되었습니다.")
                        .build());
    }

    private void deleteChatRoom(String chatRoomId) {
        RabbitMQRequestDto rabbitMQRequestDto = RabbitMQRequestDto.builder()
                .type(RabbitMQRequestType.DELETE)
                .chatRoomId(chatRoomId)
                .build();
        rabbitMQProducer.send(rabbitMQRequestDto);
    }

    private void sendDeletionCookingClassNotification(String cookingClassName, Set<UserFcmTokenDto> users) {
        if (users.isEmpty()) {
            return;
        }

        FcmNotificationDto notification = FcmNotificationDto.builder()
                .title(NotificationType.DELETION_COOKING_CLASS.getTitle())
                .body(NotificationType.DELETION_COOKING_CLASS.generateBodyWithCookingClassName(cookingClassName))
                .build();
        notificationService.sendMessagesTo(users, notification);
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

        ReservedCookingClassDto reservedCookingClass = cookingClassService.reserveClass(userDetails.user(), uuid);

        joinChatRoom(reservedCookingClass.getChatRoomId(), userDetails.getUsername());

        sendReservationCookingClassNotification(reservedCookingClass.getClassName(), reservedCookingClass.getHost(), userDetails.getNickname());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("클래스가 예약되었습니다.")
                        .data(null)
                        .build());
    }

    private void joinChatRoom(String chatRoomId, String username) {
        ChatUserDto chatUser = userChatService.getUser(username);

        RabbitMQRequestDto rabbitMQRequestDto = RabbitMQRequestDto.builder()
                .type(RabbitMQRequestType.JOIN)
                .chatRoomId(chatRoomId)
                .user(RabbitMQUserDto.builder()
                        .type(RabbitMQUserType.ATTENDEE)
                        .username(chatUser.getUsername())
                        .nickname(chatUser.getNickname())
                        .language(chatUser.getLanguage())
                        .build())
                .build();
        rabbitMQProducer.send(rabbitMQRequestDto);
    }

    private void sendReservationCookingClassNotification(String cookingClassName, UserFcmTokenDto host, String attendeeNickname) {
        if (host == null || host.getFcmToken() == null) {
            return;
        }

        FcmNotificationDto notification = FcmNotificationDto.builder()
                .title(NotificationType.RESERVATION_COOKING_CLASS.getTitle())
                .body(NotificationType.RESERVATION_COOKING_CLASS.generateBodyWithUserAndCookingClassName(attendeeNickname, cookingClassName))
                .build();
        notificationService.sendMessageTo(host, notification);
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

        ReservedCookingClassDto reservedCookingClass = cookingClassService.deleteReservation(userDetails.user(), uuid);

        leaveChatRoom(reservedCookingClass.getChatRoomId(), userDetails.getUsername());

        sendLeaveCookingClassNotification(reservedCookingClass.getClassName(), reservedCookingClass.getHost(), userDetails.getNickname());

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(CommonResponseDto.builder()
                        .stateCode(204)
                        .message("예약이 정상적으로 취소되었습니다.")
                        .data(null)
                        .build());
    }

    private void leaveChatRoom(String chatRoomId, String username) {
        ChatUserDto chatUser = userChatService.getUser(username);

        RabbitMQRequestDto rabbitMQRequestDto = RabbitMQRequestDto.builder()
                .type(RabbitMQRequestType.LEAVE)
                .chatRoomId(chatRoomId)
                .user(RabbitMQUserDto.builder()
                        .username(chatUser.getUsername())
                        .nickname(chatUser.getNickname())
                        .build())
                .build();
        rabbitMQProducer.send(rabbitMQRequestDto);
    }

    private void sendLeaveCookingClassNotification(String cookingClassName, UserFcmTokenDto host, String attendeeNickname) {
        if (host == null || host.getFcmToken() == null) {
            return;
        }

        FcmNotificationDto notification = FcmNotificationDto.builder()
                .title(NotificationType.LEAVE_COOKING_CLASS.getTitle())
                .body(NotificationType.LEAVE_COOKING_CLASS.generateBodyWithUserAndCookingClassName(attendeeNickname, cookingClassName))
                .build();
        notificationService.sendMessageTo(host, notification);
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
