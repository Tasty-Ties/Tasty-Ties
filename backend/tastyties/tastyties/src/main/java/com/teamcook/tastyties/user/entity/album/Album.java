package com.teamcook.tastyties.user.entity.album;

import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@NoArgsConstructor
@Table(indexes = {
        @Index(name = "idx_user_id", columnList = "user_id")
})
@Getter
public class Album {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int albumId;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "userId")
    private User user;

    private String albumName;
    private int folderCount;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Folder> folderList;

    public Album(String albumName) {
        this.albumName = albumName;
        this.folderCount = 0;
    }
}
