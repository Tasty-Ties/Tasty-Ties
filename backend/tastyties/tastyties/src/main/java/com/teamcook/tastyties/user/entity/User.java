package com.teamcook.tastyties.user.entity;

import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCountry;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter @Setter @ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    // orphanremoval, cascade 관계 고려 필요
    @OneToMany(mappedBy = "user")
    private Set<UserAndCookingClass> userAndCookingClasses = new HashSet<>();

    // 유저가 여는 클래스들 표현
    @OneToMany(mappedBy = "host")
    private Set<CookingClass> hostingClasses = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<UserAndCountry> userAndCountries = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id")
    private Language language;

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
