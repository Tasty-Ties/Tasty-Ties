package com.teamcook.tastyties.s3test;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface S3Service {
    Image uploadImage(MultipartFile image) throws IOException;
    List<Image> uploadImages(List<MultipartFile> images) throws IOException;
    Video uploadVideo(MultipartFile video) throws IOException;

    boolean isNotAllowedImageTypes(MultipartFile file);
    boolean isNotAllowedVideoTypes(MultipartFile file);
}

