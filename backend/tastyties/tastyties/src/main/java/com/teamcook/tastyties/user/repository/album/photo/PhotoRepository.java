package com.teamcook.tastyties.user.repository.album.photo;

import com.teamcook.tastyties.user.entity.album.Folder;
import com.teamcook.tastyties.user.entity.album.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Integer>, PhotoCustomRepository {
    List<Photo> findByFolder(Folder folder);
}
