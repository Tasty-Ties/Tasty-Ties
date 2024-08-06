package com.teamcook.tastyties.user.repository.album.photo;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.user.dto.album.PhotoResponseDto;
import com.teamcook.tastyties.user.dto.album.QPhotoResponseDto;
import com.teamcook.tastyties.user.entity.album.Folder;
import com.teamcook.tastyties.user.entity.album.QPhoto;

import java.util.List;

import static com.teamcook.tastyties.user.entity.album.QPhoto.photo;

public class PhotoRepositoryImpl implements PhotoCustomRepository {

    private final JPAQueryFactory queryFactory;

    public PhotoRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<PhotoResponseDto> getPhotoUrlsAndIndexByFolder(Folder folder) {
        return queryFactory
                .select(new QPhotoResponseDto(
                        photo.photoImageUrl,
                        photo.photoId))
                .from(photo)
                .where(photo.folder.eq(folder))
                .orderBy(photo.orderIndex.asc())
                .fetch();
    }
}
