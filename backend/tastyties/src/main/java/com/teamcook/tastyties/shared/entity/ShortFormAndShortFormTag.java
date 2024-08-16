package com.teamcook.tastyties.shared.entity;

import com.teamcook.tastyties.short_form.entity.ShortForm;
import com.teamcook.tastyties.short_form.entity.ShortFormTag;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class ShortFormAndShortFormTag {
    @Id
    @GeneratedValue
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short-form_id", nullable = false, referencedColumnName = "shortFormId")
    private ShortForm shortForm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short-form_tag_id", referencedColumnName = "shortFormTagId")
    private ShortFormTag shortFormTag;

    public ShortFormAndShortFormTag(ShortForm shortForm, ShortFormTag shortFormTag) {
        this.shortForm = shortForm;
        this.shortFormTag = shortFormTag;
    }
}
