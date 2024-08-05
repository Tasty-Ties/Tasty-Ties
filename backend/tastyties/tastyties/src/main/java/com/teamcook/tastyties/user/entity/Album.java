package com.teamcook.tastyties.user.entity;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Table(indexes = {
        @Index(name = "idx_user_id", columnList = "user_id")
})
public class Album {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int albumId;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "userId")
    private User user;

    private String albumName;
    private int folderCount;

    public Album(String albumName) {
        this.albumName = albumName;
        this.folderCount = 0;
    }

}
