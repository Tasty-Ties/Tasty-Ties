package com.teamcook.tastyties.cooking_class.repository;

import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassSearchCondition;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CookingClassCustomRepository {

    void registerClass();

    CookingClassTag findTag(String tagName);

    Page<CookingClassListDto> searchClass(CookingClassSearchCondition searchCondition, Pageable pageable);

}
