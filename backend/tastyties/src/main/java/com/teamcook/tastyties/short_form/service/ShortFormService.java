package com.teamcook.tastyties.short_form.service;

import com.teamcook.tastyties.short_form.dto.ShortFormRegisterDto;
import com.teamcook.tastyties.short_form.dto.ShortFormRegisterResponseDto;
import com.teamcook.tastyties.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface ShortFormService {
    public ShortFormRegisterResponseDto registerShortForm(User user, ShortFormRegisterDto shortFormRegisterDto, MultipartFile video) ;
}
