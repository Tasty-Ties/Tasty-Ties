package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.repository.CookingClassRepository;
import com.teamcook.tastyties.s3test.Image;
import com.teamcook.tastyties.s3test.S3Service;
import com.teamcook.tastyties.user.dto.album.AlbumRegisterResponseDto;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.album.Folder;
import com.teamcook.tastyties.user.entity.album.Photo;
import com.teamcook.tastyties.user.repository.album.AlbumRepository;
import com.teamcook.tastyties.user.repository.album.FolderRepository;
import com.teamcook.tastyties.user.repository.album.PhotoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlbumService {

    private static final Logger log = LoggerFactory.getLogger(AlbumService.class);
    private final AlbumRepository albumRepository;
    private final FolderRepository folderRepository;
    private final PhotoRepository photoRepository;
    private final S3Service s3Service;
    private final CookingClassRepository cookingClassRepository;

    @Autowired
    public AlbumService(AlbumRepository albumRepository, FolderRepository folderRepository,
                        PhotoRepository photoRepository, @Qualifier("Local") S3Service s3Service,
                        CookingClassRepository cookingClassRepository) {
        this.albumRepository = albumRepository;
        this.folderRepository = folderRepository;
        this.photoRepository = photoRepository;
        this.s3Service = s3Service;
        this.cookingClassRepository = cookingClassRepository;
    }

    public Album getAlbum(User user) {
        return albumRepository.findAlbumByUser(user);
    }

    public String registerFolder(Album album, List<MultipartFile> images,
                                                   String name, User user, String uuid) {
        Folder folder = new Folder(album, uuid, name, 4);

        List<String> urls;
        try {
            urls = s3Service.uploadImages(images).stream()
                    .map(Image::getStoredImagePath)
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException("업로드 중 문제가 생겼습니다.");
        }
        for (int i = 0; i < urls.size(); i++) {
            String url = urls.get(i);
            Photo photo = new Photo(url, i);
            log.debug("photo: {}", photo.getPhotoImageUrl());
            folder.addPhoto(photo);
        }
        Folder savedFolder = folderRepository.save(folder);
        return savedFolder.getFolderName();
    }
}
