package com.teamcook.tastyties.user.dto.album;

import com.teamcook.tastyties.common.dto.country.CountrySearchDto;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

// 폴더 리스트 응답을 위한 dto
// 폴더에 대한 간단 정보와, 검색을 위한 나라 정보를 담음
@Data
public class FolderListResponseDto {
    private Page<FolderListDto> folderListDtoPage;
    private List<CountrySearchDto> countrySearchDtoList;

    public FolderListResponseDto(Page<FolderListDto> folderListDtoPage,
                                 List<CountrySearchDto> countrySearchDtoList) {
        this.folderListDtoPage = folderListDtoPage;
        this.countrySearchDtoList = countrySearchDtoList;
    }
}
