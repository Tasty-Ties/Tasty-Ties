package com.teamcook.tastyties.common.controller;

import com.teamcook.tastyties.common.dto.CommonResponseDto;
import com.teamcook.tastyties.common.dto.post.PostDto;
import com.teamcook.tastyties.common.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PostService postService;

    @PostMapping("/post")
    public ResponseEntity<CommonResponseDto> createPost(@RequestBody PostDto post) {
        PostDto saved = postService.save(post);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("공지사항이 정상적으로 등록되었습니다.")
                        .data(saved)
                        .build());
    }

    @PutMapping("/post/{id}")
    public ResponseEntity<CommonResponseDto> modifyPost(@PathVariable long id, @RequestBody PostDto post) {
        PostDto saved = postService.modify(id, post);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("공지사항이 정상적으로 수정되었습니다.")
                        .data(saved)
                        .build());
    }

    @GetMapping("/post")
    public ResponseEntity<CommonResponseDto> getPosts(Pageable pageable) {
        Page<PostDto> postsByPage = postService.findPostsByPage(pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 조회되었습니다.")
                        .data(postsByPage)
                        .build());
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<CommonResponseDto> getPost(@PathVariable Long id) {
        PostDto postById = postService.findPostById(id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("정상적으로 조회되었습니다.")
                        .data(postById)
                        .build());
    }

    @DeleteMapping("/post/{id}")
    public ResponseEntity<CommonResponseDto> deletePost(@PathVariable Long id) {
        postService.deleteById(id);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(CommonResponseDto.builder()
                        .stateCode(204)
                        .message("정상적으로 삭제되었습니다.")
                        .build());
    }
}
