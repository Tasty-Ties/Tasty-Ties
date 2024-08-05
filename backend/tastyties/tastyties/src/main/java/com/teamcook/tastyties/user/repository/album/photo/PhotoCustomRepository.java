package com.teamcook.tastyties.user.repository.album.photo;

import com.teamcook.tastyties.user.entity.album.Folder;

import java.util.List;

public interface PhotoCustomRepository {
    List<String> getPhotoUrlsByFolder(Folder folder);
}
