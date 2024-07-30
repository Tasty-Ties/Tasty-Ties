package com.teamcook.tastyties.shared.entity;

import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
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

    @PrePersist
    protected void onCreate() {
        flagCreateTime = LocalDateTime.now();
    }
}
