package com.teamcook.tastyties.user.dto.album;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class FolderListDto {
    private int folderId;
    private String folderName;
    private String countryCode;
    private String mainImgUrl;

    @QueryProjection
    public FolderListDto(int folderId, String folderName,
                         String countryCode, String mainImgUrl) {
        this.folderId = folderId;
        this.folderName = folderName;
        this.countryCode = countryCode;
        this.mainImgUrl = mainImgUrl;
    }
}
