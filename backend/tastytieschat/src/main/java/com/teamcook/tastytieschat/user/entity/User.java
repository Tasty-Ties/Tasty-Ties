package com.teamcook.tastytieschat.user.entity;

import com.teamcook.tastytieschat.notification.entity.FcmNotification;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;
    @NotNull
    @Column(nullable = false, unique = true)
    private String username;
    @NotNull
    @Column(nullable = false)
    private String password;
    private String fcmToken;
    @OneToMany(mappedBy = "user")
    private Set<FcmNotification> notifications = new HashSet<>();
    private boolean isDeleted = Boolean.FALSE;
}
