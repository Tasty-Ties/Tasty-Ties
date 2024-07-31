package com.teamcook.tastyties.s3test;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface S3Service {
    Image uploadImage(MultipartFile image) throws IOException;
}
