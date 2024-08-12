package com.teamcook.tastyties.user.entity.album;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
public class Folder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int folderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", referencedColumnName = "albumId")
    private Album album;

    private String cookingClassUuid;
    private String folderName;
    private int maxPhotoCount;
    private String countryCode;
    @Setter
    private String mainImgUrl;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Photo> photoList = new ArrayList<>();

    public Folder(Album album, String cookingClassUuid, String folderName,
                  int maxPhotoCount, String countryCode) {
        this.album = album;
        this.cookingClassUuid = cookingClassUuid;
        this.folderName = folderName;
        this.maxPhotoCount = maxPhotoCount;
        this.countryCode = countryCode;
    }

    public void updateFolder(Album album, String cookingClassUuid, String folderName,
                             int maxPhotoCount, String countryCode) {
        if (maxPhotoCount < 0) {
            throw new IllegalArgumentException("maxPhotoCount 는 음수가 될 수 없습니다.");
        }
        this.album = album;
        this.cookingClassUuid = cookingClassUuid;
        this.folderName = folderName;
        this.maxPhotoCount = maxPhotoCount;
        this.countryCode = countryCode;
    }

    public void addPhoto(Photo photo) {
        photoList.add(photo);
        photo.setFolder(this);
    }
}
