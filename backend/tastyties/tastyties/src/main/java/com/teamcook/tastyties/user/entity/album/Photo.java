package com.teamcook.tastyties.user.entity.album;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
public class Photo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int photoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", referencedColumnName = "folderId")
    @Setter
    private Folder folder;

    private String photoImageUrl;
    private int orderIndex;

    public Photo(String photoImageUrl, int orderIndex) {
        this.photoImageUrl = photoImageUrl;
        this.orderIndex = orderIndex;
    }
}
