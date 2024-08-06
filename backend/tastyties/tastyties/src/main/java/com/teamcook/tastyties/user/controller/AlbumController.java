package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.service.AlbumService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/albums")
public class AlbumController {

    private final AlbumService albumService;

    @Autowired
    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @GetMapping("/test")
    public String test(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Album album = albumService.getAlbum(userDetails.user());
        log.debug("album: {}", album.getAlbumName());
        return "test";
    }

    @PostMapping("/register-folder")
    public ResponseEntity<CommonResponseDto> registerFolder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                            @RequestPart("images") List<MultipartFile> images,
                                                            @RequestPart("name") String name, @RequestPart("uuid") String uuid) {
        User user = userDetails.user();
        Album album = albumService.getAlbum(user);
        String folderName = albumService.registerFolder(album, images, name, user, uuid);
//        albumService
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("프로필이 정상적으로 조회됐습니다.")
                        .data(folderName)
                        .build());
    }
}
