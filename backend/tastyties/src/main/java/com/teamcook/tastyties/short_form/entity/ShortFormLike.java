package com.teamcook.tastyties.short_form.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ShortFormLike {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shortFormLikeId;
    private boolean isLike;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short-form_id", referencedColumnName = "shortFormId")
    private ShortForm shortForm;

    @PrePersist
    protected void onCreate() {
        isLike = false;
    }

    public void setShortForm(ShortForm shortForm) {
        this.shortForm = shortForm;
        if (!shortForm.getShortFormLikes().contains(this)) {
            shortForm.getShortFormLikes().add(this);
        }
    }
}
