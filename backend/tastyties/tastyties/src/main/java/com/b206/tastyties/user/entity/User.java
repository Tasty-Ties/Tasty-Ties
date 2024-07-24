package com.b206.tastyties.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    private String countryCode;
    private String languageCode;

    private String username;
    private String password;
    private String nickname;

    private String profileImageUrl;
    private LocalDate birth;

    private String emailId;
    private String emailDomain;

    private String description;
    private boolean isDeleted;
    private boolean isAdult;

    private String instagramUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String youtubeHandle;
}
