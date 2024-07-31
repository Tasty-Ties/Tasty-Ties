package com.teamcook.tastyties.s3test;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3serviceImpl implements S3Service {

    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;

    private final AmazonS3 amazonS3;

    public S3serviceImpl(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    @Override
    public Image uploadImage(MultipartFile image) throws IOException {
        String originName = image.getOriginalFilename();
        String storedImagePath = uploadImageToS3(image);

        Image newImage = Image.builder() //이미지에 대한 정보를 담아서 반환
                .originName(originName)
                .storedImagePath(storedImagePath)
                .build();

        return newImage;
    }

    private String uploadImageToS3(MultipartFile image) throws IOException {
        String originName = image.getOriginalFilename(); //원본 이미지 이름
        String ext = originName.substring(originName.lastIndexOf(".")); //확장자
        String changedName = getUuidName(originName); //새로 생성된 이미지 이름
        ObjectMetadata metadata = new ObjectMetadata(); //메타데이터
        metadata.setContentType("image/" + ext); //여기서 image 아닌 건 타입 별도로 설정해야함
        PutObjectResult putObjectResult = amazonS3.putObject(new PutObjectRequest(
                bucketName, changedName, image.getInputStream(), metadata
        ).withCannedAcl(CannedAccessControlList.PublicRead));
        return amazonS3.getUrl(bucketName, changedName).toString(); //데이터베이스에 저장할 이미지가 저장된 주소
    }

    private String getUuidName(String originName) {
        String randomId = UUID.randomUUID().toString();
        return randomId + "_" + originName;
    }
}
