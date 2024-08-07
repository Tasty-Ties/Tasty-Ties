package com.teamcook.tastyties.user.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.security.userdetails.CustomUserDetails;
import com.teamcook.tastyties.user.dto.album.*;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.album.Photo;
import com.teamcook.tastyties.user.service.AlbumService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // 쿠킹 클래스가 끝난 후 폴더를 등록
    @PostMapping("/register-folder")
    public ResponseEntity<CommonResponseDto> registerFolder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                            @RequestPart("images") List<MultipartFile> images,
                                                            @RequestPart("folderRegisterDto") FolderRegisterDto registerDto) {
        User user = userDetails.user();
        Album album = albumService.getAlbum(user);
        String folderName = albumService.registerFolder(album, images, registerDto);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("사진이 정상적으로 저장되었습니다.")
                        .data(folderName)
                        .build());
    }

    // 앨범의 정보를 불러옴
    @GetMapping()
    public ResponseEntity<CommonResponseDto> getAlbum(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                      Pageable pageable,
                                                      @RequestParam(required = false) String countryCode) {
        log.debug("countryCode: {}", countryCode);
        Album album = albumService.getAlbum(userDetails.user());
        FolderListResponseDto folderList = albumService.getFolderList(album, pageable, countryCode);

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("앨범을 정상적으로 조회했습니다.")
                        .data(folderList)
                        .build());
    }

    // folderId에 따른 폴더의 상세정보를 불러옴
    @GetMapping("/{folderId}")
    public ResponseEntity<CommonResponseDto> getFolder(@PathVariable int folderId) {

        FolderResponseDto folderDetail = albumService.getFolderDetail(folderId);

        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("앨범을 정상적으로 조회했습니다.")
                        .data(folderDetail)
                        .build());
    }

    // 폴더 안에 있는 사진의 숫자를 정렬함
    @PatchMapping("/{folderId}/order")
    public ResponseEntity<CommonResponseDto> orderPhotos(@PathVariable int folderId,
                                                         @RequestBody List<PhotoOrderChangeDto> photoOrderChangeDtos) {
        List<Photo> photos = albumService.updatePhotoOrder(folderId, photoOrderChangeDtos);
        return ResponseEntity.ok()
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("사진의 순서를 정상적으로 변경했습니다.")
                        .data(null)
                        .build());
    }
}
