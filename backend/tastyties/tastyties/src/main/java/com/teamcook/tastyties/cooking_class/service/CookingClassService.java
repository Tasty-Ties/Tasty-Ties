package com.teamcook.tastyties.cooking_class.service;

import com.teamcook.tastyties.cooking_class.dto.CookingClassRegisterDto;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.cooking_class.entity.CookingClassTag;
import com.teamcook.tastyties.cooking_class.entity.Ingredient;
import com.teamcook.tastyties.cooking_class.repository.CookingClassRepository;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CookingClassService {
    private final CookingClassRepository ccRepository;

    public CookingClassService(CookingClassRepository ccRepository) {
        this.ccRepository = ccRepository;
    }

    @Transactional
    public void registerClass(User user, CookingClassRegisterDto registerDto) {
        CookingClass cc = new CookingClass();
        cc.setHost(user);
        cc.setLanguageCode(user.getLanguageCode());
        cc.setCountryCode(user.getCountryCode());

        cc.setTitle(registerDto.getTitle());
        cc.setDescription(registerDto.getDescription());
        cc.setDishName(registerDto.getDishName());
        cc.setDishCookingTime(registerDto.getDishCookingTime());
        cc.setLevel(registerDto.getLevel());
        cc.setQuota(registerDto.getQuota());
        cc.setLimitedAge(registerDto.isLimitedAge());
        cc.setCookingClassStartTime(registerDto.getCookingClassStartTime());
        cc.setCookingClassEndTime(registerDto.getCookingClassEndTime());
        cc.setReplayEndTime(registerDto.getReplayEndTime());

        ccRepository.save(cc);
    }

}
