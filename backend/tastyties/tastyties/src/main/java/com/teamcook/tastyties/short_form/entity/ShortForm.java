package com.teamcook.tastyties.short_form.entity;

import com.teamcook.tastyties.short_form.enums.Category;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class ShortForm {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shortFormId;

    @NotNull @Column(nullable = false)
    private String uuid;
    @NotNull @Column(nullable = false)
    private String title;
    @NotNull @Column(nullable = false)
    private String shortFormVideoUrl;

    private LocalDateTime createTime;
    private int hit;
    private boolean isDelete;

    @NotNull @Column(nullable = false)
    private Category category;

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        uuid = UUID.randomUUID().toString();
        isDelete = false;
        hit = 0;
    }
}
