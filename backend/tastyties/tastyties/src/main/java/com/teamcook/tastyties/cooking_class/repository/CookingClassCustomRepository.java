package com.teamcook.tastyties.cooking_class.repository;

import com.teamcook.tastyties.cooking_class.dto.CookingClassDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassListDto;
import com.teamcook.tastyties.cooking_class.dto.CookingClassSearchCondition;
import com.teamcook.tastyties.cooking_class.dto.ReservedCookingClassDto;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface CookingClassCustomRepository {

    void registerClass();

    CookingClassTag findTag(String tagName);

    Page<CookingClassListDto> searchClass(CookingClassSearchCondition searchCondition, Pageable pageable);

    CookingClass findWithUuid(String uuid);

    CookingClassDto findCookingClassDtoWithUuid(String uuid);
    CookingClass findClassForDelete(String uuid);

    Page<CookingClassListDto> searchClassByHostId(int hostId, Pageable pageable);
    Set<CookingClassListDto> searchClassByHostIdForProfile(int hostId);

    boolean isCookingClassHost(int hostId, String uuid);

    void updateSessionIdByCookingClassId(String sessionId, String uuid);

    boolean isCookingClassGuest(Integer userId, String uuid);

    String findSessionIdWidthUuid(String uuid);
}
