package com.teamcook.tastyties.s3test;

import com.teamcook.tastyties.common.dto.CommonResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

@Slf4j
@RestController
@RequestMapping("/s3")
@CrossOrigin(origins = "*")
public class S3controller {

    private final S3Service s3Service;

    @Autowired
    public S3controller(S3serviceImpl s3ServiceImpl) {
        this.s3Service = s3ServiceImpl;
    }

    @PostMapping("/upload")
    public ResponseEntity<CommonResponseDTO> fileUploadTest(
            @RequestPart("file") MultipartFile file) throws SQLException, IOException {
        Image image =  s3Service.uploadImage(file);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new CommonResponseDTO(201, "파일 업로드 성공",image));
    }
}
