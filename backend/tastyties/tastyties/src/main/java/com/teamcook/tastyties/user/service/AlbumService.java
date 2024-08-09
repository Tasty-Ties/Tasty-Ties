package com.teamcook.tastyties.user.service;

import com.teamcook.tastyties.common.dto.country.CountrySearchDto;
import com.teamcook.tastyties.common.repository.CountryRepository;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.repository.CookingClassRepository;
import com.teamcook.tastyties.exception.FolderNotFoundException;
import com.teamcook.tastyties.s3test.Image;
import com.teamcook.tastyties.s3test.S3Service;
import com.teamcook.tastyties.shared.repository.UserAndCookingClassRepository;
import com.teamcook.tastyties.user.dto.UserSimpleProfileDto;
import com.teamcook.tastyties.user.dto.album.*;
import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.album.Folder;
import com.teamcook.tastyties.user.entity.album.Photo;
import com.teamcook.tastyties.user.repository.album.AlbumRepository;
import com.teamcook.tastyties.user.repository.album.folder.FolderRepository;
import com.teamcook.tastyties.user.repository.album.photo.PhotoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AlbumService {

    private static final Logger log = LoggerFactory.getLogger(AlbumService.class);
    private final AlbumRepository albumRepository;
    private final FolderRepository folderRepository;
    private final PhotoRepository photoRepository;
    private final S3Service s3Service;
    private final CookingClassRepository cookingClassRepository;
    private final UserAndCookingClassRepository userAndCookingClassRepository;
    private final CountryRepository countryRepository;

    @Autowired
    public AlbumService(AlbumRepository albumRepository, FolderRepository folderRepository,
                        PhotoRepository photoRepository, @Qualifier("S3") S3Service s3Service,
                        CookingClassRepository cookingClassRepository,
                        UserAndCookingClassRepository userAndCookingClassRepository,
                        CountryRepository countryRepository) {
        this.albumRepository = albumRepository;
        this.folderRepository = folderRepository;
        this.photoRepository = photoRepository;
        this.s3Service = s3Service;
        this.cookingClassRepository = cookingClassRepository;
        this.userAndCookingClassRepository = userAndCookingClassRepository;
        this.countryRepository = countryRepository;
    }

    // 문제가 생긴다면 여기부터 확인
    public Album getAlbum(User user) {
        return albumRepository.findAlbumByUser(user);
    }

    @Transactional
    public String registerFolder(Album album, List<MultipartFile> images,
                                 FolderRegisterDto registerDto) {

        Folder folder = new Folder(album, registerDto.getCookingClassUuid(),
                registerDto.getFolderName(), 4, registerDto.getCountryCode());
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
        folder.setMainImgUrl(urls.get(0));
        Folder savedFolder = folderRepository.save(folder);
        return savedFolder.getFolderName();
    }

    public FolderListResponseDto getFolderList(Album album, Pageable pageable, String countryCode) {
        Page<FolderListDto> folderListByAlbum = folderRepository.getFolderListByAlbum(album, pageable, countryCode);
        List<CountrySearchDto> countryDistinctList = folderRepository.getCountryDistinctList(album);
        return new FolderListResponseDto(folderListByAlbum, countryDistinctList);
    }

    @Transactional
    public FolderResponseDto getFolderDetail(int folderId) {
        Optional<Folder> findFolder = folderRepository.findById(folderId);
        if (findFolder.isEmpty()) {
            throw new FolderNotFoundException("폴더의 정보를 불러올 수 없습니다.");
        }
        Folder folder = findFolder.get();
        FolderResponseDto folderDto = folderRepository.getFolderDto(folder);
        CookingClass cookingClass = cookingClassRepository.findByUuid(folder.getCookingClassUuid());
        List<PhotoResponseDto> photoUrlsByFolder = photoRepository.getPhotoUrlsAndIndexByFolder(folder);
        Set<UserSimpleProfileDto> userEnrolledInClass = userAndCookingClassRepository.findUserEnrolledInClass(cookingClass);


        folderDto.setPhotoResponse(photoUrlsByFolder);
        folderDto.setUserProfiles(userEnrolledInClass);
        return folderDto;
    }

    @Transactional
    public List<Photo> updatePhotoOrder(int folderId, List<PhotoOrderChangeDto> orderChangeDtos) {
        Optional<Folder> findFolder = folderRepository.findById(folderId);
        if (findFolder.isEmpty()) {
            throw new FolderNotFoundException("폴더의 정보를 불러올 수 없습니다.");
        }
        Folder folder = findFolder.get();
        List<Photo> photos = photoRepository.findByFolder(folder);
        Map<Integer, Photo> photoMap = photos.stream()
                .collect(Collectors.toMap(Photo::getPhotoId, photo -> photo));

        for (PhotoOrderChangeDto dto : orderChangeDtos) {
            Photo photo = photoMap.get(dto.getPhotoId());
            if (photo != null) {
                photo.setOrderIndex(dto.getOrderIndex());
            } else {
                throw new IllegalArgumentException("Photo ID " + dto.getPhotoId() + " 를 찾을 수 없습니다.");
            }
            if (dto.getOrderIndex() == 0) {
                folder.setMainImgUrl(photo.getPhotoImageUrl());
            }
        }
        return photos;
    }
}
