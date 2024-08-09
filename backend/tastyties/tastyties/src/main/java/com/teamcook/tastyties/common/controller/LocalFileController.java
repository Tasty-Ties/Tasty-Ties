package com.teamcook.tastyties.common.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/local")
public class LocalFileController {

    private final Path imageStorageLocation;
    private final Path videoStorageLocation;

    public LocalFileController(@Value("${file.upload-image-dir}") String imageUploadDir,
                               @Value("${file.upload-video-dir}") String videoUploadDir) {
        this.imageStorageLocation = Paths.get(imageUploadDir).toAbsolutePath().normalize();
        this.videoStorageLocation = Paths.get(videoUploadDir).toAbsolutePath().normalize();
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        return serveFile(imageStorageLocation, filename);
    }

    @GetMapping("/videos/{filename:.+}")
    public ResponseEntity<Resource> getVideo(@PathVariable String filename) {
        return serveFile(videoStorageLocation, filename);
    }

    private ResponseEntity<Resource> serveFile(Path storageLocation, String filename) {
        try {
            Path file = storageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
