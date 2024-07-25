package com.b206.tastyties.user.entity;

import jakarta.persistence.*;
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

    @Column(nullable = false)
    private String countryCode;
    @Column(nullable = false)
    private String languageCode;

    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String nickname;

    private String profileImageUrl;
    @Column(nullable = false)
    private LocalDate birth;

    @Column(nullable = false, unique = true)
    private String email;

    private String description;
    private boolean isDeleted = Boolean.FALSE;
    private boolean isAdult = Boolean.FALSE;

    private String instagramUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String youtubeHandle;
}
