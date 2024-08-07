package com.teamcook.tastytieschat.notification.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;
    private String fcmToken;
    @OneToMany(mappedBy = "user")
    private Set<FcmNotification> notifications = new HashSet<>();
}
