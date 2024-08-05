package com.teamcook.tastyties.user.repository.album.photo;

import com.querydsl.jpa.impl.JPAQueryFactory;
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
    public List<String> getPhotoUrlsByFolder(Folder folder) {
        return queryFactory
                .select(photo.photoImageUrl)
                .from(photo)
                .where(photo.folder.eq(folder))
                .orderBy(photo.orderIndex.asc())
                .fetch();
    }
}
