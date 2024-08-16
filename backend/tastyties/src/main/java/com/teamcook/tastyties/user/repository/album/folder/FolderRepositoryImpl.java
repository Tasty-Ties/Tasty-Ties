package com.teamcook.tastyties.user.repository.album.folder;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamcook.tastyties.common.dto.country.CountrySearchDto;
import com.teamcook.tastyties.common.dto.country.QCountrySearchDto;
import com.teamcook.tastyties.user.dto.QUserSimpleProfileDto;
import com.teamcook.tastyties.user.dto.album.FolderListDto;
import com.teamcook.tastyties.user.dto.album.FolderResponseDto;
import com.teamcook.tastyties.user.dto.album.QFolderListDto;
import com.teamcook.tastyties.user.dto.album.QFolderResponseDto;
import com.teamcook.tastyties.user.entity.album.Album;
import com.teamcook.tastyties.user.entity.album.Folder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.teamcook.tastyties.common.entity.QCountry.country;
import static com.teamcook.tastyties.cooking_class.entity.QCookingClass.cookingClass;
import static com.teamcook.tastyties.user.entity.QUser.user;
import static com.teamcook.tastyties.user.entity.album.QAlbum.album;
import static com.teamcook.tastyties.user.entity.album.QFolder.folder;
import static org.springframework.util.StringUtils.hasText;

public class FolderRepositoryImpl implements FolderCustomRepository {

    private final JPAQueryFactory queryFactory;

    public FolderRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<FolderListDto> getFolderListByAlbum(Album targetAlbum, Pageable pageable,
                                                    String countryCode) {
        List<FolderListDto> results = queryFactory.select(
                        new QFolderListDto(folder.folderId, folder.folderName,
                                folder.countryCode, folder.mainImgUrl))
                .from(folder)
                .join(folder.album, album)
                .where(album.eq(targetAlbum), countryCodeEq(countryCode))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory.select(folder.count())
                .from(folder)
                .join(folder.album, album)
                .where(album.eq(targetAlbum), countryCodeEq(countryCode));

        return PageableExecutionUtils.getPage(results, pageable, countQuery::fetchOne);
    }

    @Override
    public FolderResponseDto getFolderDto(Folder findFolder) {
        return queryFactory
                .select(new QFolderResponseDto(
                    folder.folderName,
                        new QUserSimpleProfileDto(user.profileImageUrl, user.nickname, user.username),
                        cookingClass.cookingClassStartTime,
                        cookingClass.cookingClassEndTime
                )).from(folder)
                .join(cookingClass).on(cookingClass.uuid.eq(folder.cookingClassUuid))
                .join(cookingClass.host, user)
                .where(folder.eq(findFolder))
                .fetchOne();
    }

    private BooleanExpression countryCodeEq(String countryCode) {
        return hasText(countryCode) ? folder.countryCode.eq(countryCode) : null;
    }

    @Override
    public List<CountrySearchDto> getCountryDistinctList(Album album) {
        return queryFactory
                .select(new QCountrySearchDto(
                    country.alpha2, country.koreanName
                )).from(folder)
                .join(country).on(folder.countryCode.eq(country.alpha2))
                .where(folder.album.eq(album))
                .distinct()
                .fetch();
    }


}
