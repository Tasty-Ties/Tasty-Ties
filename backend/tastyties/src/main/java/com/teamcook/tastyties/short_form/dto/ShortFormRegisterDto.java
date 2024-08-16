package com.teamcook.tastyties.short_form.dto;

import com.teamcook.tastyties.short_form.enums.Category;
import lombok.Data;

import java.util.Set;

@Data
public class ShortFormRegisterDto {
    private String title;
    private Category category;
    private Set<String> shortFormTags;
}
