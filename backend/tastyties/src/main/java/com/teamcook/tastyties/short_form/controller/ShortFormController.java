package com.teamcook.tastyties.short_form.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.short_form.dto.ShortFormRegisterDto;
import com.teamcook.tastyties.short_form.dto.ShortFormRegisterResponseDto;
import com.teamcook.tastyties.short_form.entity.ShortForm;
import com.teamcook.tastyties.short_form.service.ShortFormService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/short-form")
public class ShortFormController {

    private final ShortFormService shortFormService;

    public ShortFormController(ShortFormService shortFormService) {
        this.shortFormService = shortFormService;
    }

    @PostMapping("/upload")
    public ResponseEntity<CommonResponseDto> uploadVideo(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("video") MultipartFile video,
            @RequestPart("shortFormUploadDto") ShortFormRegisterDto shortFormRegisterDto) {

        ShortFormRegisterResponseDto shortForm = shortFormService.registerShortForm(userDetails.user(), shortFormRegisterDto, video);
        return ResponseEntity.created(null)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("정상적으로 영상이 등록되었습니다.")
                        .data(shortForm)
                        .build());
    }
}
