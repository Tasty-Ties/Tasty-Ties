package com.teamcook.tastyties.user.entity;

import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.common.entity.Language;
import com.teamcook.tastyties.cooking_class.entity.CookingClass;
import com.teamcook.tastyties.notification.entity.FcmNotification;
import com.teamcook.tastyties.shared.entity.UserAndCookingClass;
import com.teamcook.tastyties.shared.entity.UserAndCountry;
import com.teamcook.tastyties.short_form.entity.ShortForm;
import com.teamcook.tastyties.user.dto.UserUpdateDto;
import com.teamcook.tastyties.user.entity.album.Album;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter @NoArgsConstructor
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
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;

    @NotNull @Column(nullable = false, unique = true)
    private String username;
    @NotNull @Column(nullable = false)
    private String password;
    @NotNull @Column(nullable = false, unique = true)
    private String nickname;

    @NotNull @Column(nullable = false)
    private LocalDate birth;

    @NotNull @Column(nullable = false, unique = true)
    private String email;

    private String description;
    private boolean isDeleted = Boolean.FALSE;
    private boolean isAdult = Boolean.FALSE;

    @NotNull @Column(nullable = false)
    private String role;

    @Setter
    private String profileImageUrl;

    private String instagramUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String youtubeHandle;

    private double activityPoint = 0;

    @Setter
    private String fcmToken;

    // 유저 알람
    @OneToMany(mappedBy = "user")
    private Set<FcmNotification> notifications = new HashSet<>();

    // short-form
    @OneToMany(mappedBy = "user")
    private List<ShortForm> shortForm;

    // album
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Album> albumList = new ArrayList<>();

    // 유저 통계
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private UserStatistics userStatistics;

    // 마일리지 적립 로그
    @OneToMany(mappedBy = "user")
    private List<ActivityPointLog> activityPointLogs = new ArrayList<>();

    public User(Country country, Language language, String username,
                String password, String nickname, LocalDate birth,
                String email, String role) {
        this.country = country;
        this.language = language;
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.birth = birth;
        this.email = email;
        this.role = role;
    }

    public void addAlbum(Album album) {
        albumList.add(album);
        album.setUser(this);
    }

    public void addStatistics(UserStatistics userStatistics) {
        this.userStatistics = userStatistics;
        userStatistics.setUser(this);
    }

    public void updateUser(UserUpdateDto request, String encodedPassword, String instagramHandle, String youtubeHandle) {
        this.nickname = request.getNickname();
        if (encodedPassword != null) {
            this.password = encodedPassword;
        }
        this.description = request.getDescription();
        this.email = request.getEmailId() + "@" + request.getEmailDomain();
        if (request.getInstagramUrl() != null && !request.getInstagramUrl().isEmpty()) {
            this.instagramUrl = request.getInstagramUrl();
            this.instagramHandle = instagramHandle;
        }
        if (request.getYoutubeUrl() != null && !request.getYoutubeUrl().isEmpty()) {
            this.youtubeUrl = request.getYoutubeUrl();
            this.youtubeHandle = youtubeHandle;
        }
    }

    public void addActivityPointLog(ActivityPointLog log) {
        activityPointLogs.add(log);
        log.setUser(this);
        this.activityPoint += log.getAmount();
    }


    public void delete() {
        this.isDeleted = true;
    }
}
