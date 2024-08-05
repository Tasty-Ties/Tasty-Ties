package com.teamcook.tastyties.user.entity.album;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Photo> photoList = new ArrayList<>();

    public Folder(Album album, String cookingClassUuid,
                  String folderName, int maxPhotoCount) {
        this.album = album;
        this.cookingClassUuid = cookingClassUuid;
        this.folderName = folderName;
        this.maxPhotoCount = maxPhotoCount;
    }

    public void addPhoto(Photo photo) {
        photoList.add(photo);
        photo.setFolder(this);
    }
}
