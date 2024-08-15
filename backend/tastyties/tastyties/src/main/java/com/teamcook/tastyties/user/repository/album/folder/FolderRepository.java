package com.teamcook.tastyties.user.repository.album.folder;

import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.album.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<Folder, Integer>, FolderCustomRepository {
    Folder findByCookingClassUuidAndAlbum(String cookingClassUuid, Album album);
}
