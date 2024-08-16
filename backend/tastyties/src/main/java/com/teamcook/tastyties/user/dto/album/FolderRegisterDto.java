package com.teamcook.tastyties.user.dto.album;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class FolderRegisterDto {
    private String folderName;
    private String cookingClassUuid;
    private String countryCode;
}
