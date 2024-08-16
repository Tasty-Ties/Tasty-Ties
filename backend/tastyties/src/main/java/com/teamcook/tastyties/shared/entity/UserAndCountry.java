package com.teamcook.tastyties.shared.entity;

import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter @NoArgsConstructor
public class UserAndCountry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userFlagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    private LocalDateTime flagCreateTime;

    public UserAndCountry(User user, Country country) {
        this.user = user;
        this.country = country;
    }

    @PrePersist
    protected void onCreate() {
        flagCreateTime = LocalDateTime.now();
    }
}
