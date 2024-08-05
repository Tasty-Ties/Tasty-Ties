package com.teamcook.tastyties.user.repository.album;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.QCookingClass;
import com.teamcook.tastyties.user.dto.album.FolderListDto;
import com.teamcook.tastyties.user.dto.album.QFolderListDto;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.album.QFolder;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static com.teamcook.tastyties.cooking_class.entity.QCookingClass.cookingClass;
import static com.teamcook.tastyties.user.entity.album.QFolder.folder;

public class FolderRepositoryImpl implements FolderCustomRepository {

    private final JPAQueryFactory queryFactory;

    public FolderRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<FolderListDto> getFolderListByAlbum(Album album, Pageable pageable) {
        return queryFactory.select(
                new QFolderListDto(folder.folderId, folder.folderName,
                        folder.countryCode, folder.mainImgUrl))
                .from(folder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }
}
