package com.teamcook.tastyties.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Getter @Setter @ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @NotNull @Column(nullable = false)
    private String countryCode;
    @NotNull @Column(nullable = false)
    private String languageCode;

    @NotNull @Column(nullable = false)
    private String username;
    @NotNull @Column(nullable = false)
    private String password;
    @NotNull @Column(nullable = false)
    private String nickname;

    private String profileImageUrl;
    @NotNull @Column(nullable = false)
    private LocalDate birth;

    @NotNull @Column(nullable = false, unique = true)
    private String email;

    private String description;
    private boolean isDeleted = Boolean.FALSE;
    private boolean isAdult = Boolean.FALSE;

    private String instagramUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String youtubeHandle;
}
