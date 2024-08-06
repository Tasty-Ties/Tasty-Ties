package com.teamcook.tastyties.short_form.entity;

import com.teamcook.tastyties.shared.entity.ShortFormAndShortFormTag;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@NoArgsConstructor
public class ShortFormTag {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shortFormTagId;
    private String shortFormTagName;

    @OneToMany(mappedBy = "shortFormTag")
    private List<ShortFormAndShortFormTag> shortFormAndShortFormTags;

    public ShortFormTag(String shortFormTagName) {
        this.shortFormTagName = shortFormTagName;
    }
}
