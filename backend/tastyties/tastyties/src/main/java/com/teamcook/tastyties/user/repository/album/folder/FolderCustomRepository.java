package com.teamcook.tastyties.user.repository.album.folder;

import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.user.dto.album.FolderListDto;
import com.teamcook.tastyties.user.dto.album.FolderResponseDto;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.album.Folder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FolderCustomRepository {
    Page<FolderListDto> getFolderListByAlbum(Album album, Pageable pageable, String countryCode);

    FolderResponseDto getFolderDto(Folder folder);
}
