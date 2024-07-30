package com.teamcook.tastyties.cooking_class.repository;

import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;

public interface CookingClassCustomRepository {

    void registerClass();

    CookingClassTag findTag(String tagName);
}
