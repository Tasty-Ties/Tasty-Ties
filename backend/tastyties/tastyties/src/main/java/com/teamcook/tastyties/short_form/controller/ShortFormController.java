package com.teamcook.tastyties.short_form.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/short-form")
public class ShortFormController {

    @PostMapping("/upload")
    public ResponseEntity<CommonResponseDto> uploadVideo(@RequestParam("video") MultipartFile video) {
        return null;
    }
}
