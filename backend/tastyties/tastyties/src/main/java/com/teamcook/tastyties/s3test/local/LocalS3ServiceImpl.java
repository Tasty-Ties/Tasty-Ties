package com.teamcook.tastyties.s3test.local;

import com.teamcook.tastyties.s3test.Image;
import com.teamcook.tastyties.s3test.S3Service;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Qualifier("Local")
public class LocalS3ServiceImpl implements S3Service {

    private final Path fileStorageLocation;

    public LocalS3ServiceImpl(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public Image uploadImage(MultipartFile image) throws IOException {
        if (!isAllowedTypes(image)) {
            throw new IOException("지원하지 않는 이미지 타입입니다: " + image.getOriginalFilename());
        }
        String originName = image.getOriginalFilename();
        String storedImagePath = uploadImageToLocal(image);

        return Image.builder() //이미지에 대한 정보를 담아서 반환
                .originName(originName)
                .storedImagePath(storedImagePath)
                .build();
    }

    private String uploadImageToLocal(MultipartFile image) throws IOException {
        String originName = image.getOriginalFilename();
        String fileName = getUuidName(originName);
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return targetLocation.toString();
    }

    private String getUuidName(String originName) {
        String randomId = UUID.randomUUID().toString();
        return randomId + "_" + originName;
    }


    @Override
    public List<Image> uploadImages(List<MultipartFile> images) throws IOException {
        return images.stream()
                .map(image -> {
                    try {
                        return uploadImage(image);
                    } catch (IOException e) {
                        throw new RuntimeException("이미지 업로드 실패", e);
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAllowedTypes(MultipartFile file) {
        String fileType = file.getContentType();
        List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png", "image/jpg");
        return allowedTypes.contains(fileType);
    }
}
