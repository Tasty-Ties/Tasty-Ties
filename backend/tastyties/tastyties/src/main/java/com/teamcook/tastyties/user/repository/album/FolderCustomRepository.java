package com.teamcook.tastyties.user.repository.album;

import com.teamcook.tastyties.user.dto.album.FolderListDto;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.album.Folder;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FolderCustomRepository {
    List<FolderListDto> getFolderListByAlbum(Album album, Pageable pageable);
}
