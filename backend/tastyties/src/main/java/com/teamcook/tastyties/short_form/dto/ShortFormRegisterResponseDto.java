package com.teamcook.tastyties.short_form.dto;

import com.teamcook.tastyties.short_form.entity.ShortForm;
import lombok.Data;

@Data
public class ShortFormRegisterResponseDto {
    private String title;
    private String uuid;
    private String shortFormVideoUrl;
    private String nickName;

    public ShortFormRegisterResponseDto(ShortForm shortForm) {
        this.title = shortForm.getTitle();
        this.uuid = shortForm.getUuid();
        this.shortFormVideoUrl = shortForm.getShortFormVideoUrl();
        this.nickName = shortForm.getUser().getNickname();
    }
}
