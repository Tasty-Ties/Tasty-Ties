package com.teamcook.tastyties.cooking_class.repository;

import com.teamcook.tastyties.cooking_class.dto.CookingClassDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassSearchCondition;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CookingClassCustomRepository {

    void registerClass();

    CookingClassTag findTag(String tagName);

    Page<CookingClassListDto> searchClass(CookingClassSearchCondition searchCondition, Pageable pageable);

    CookingClass findWithUuid(String uuid);

    Page<CookingClassListDto> searchClassByHostId(int hostId, Pageable pageable);
}
