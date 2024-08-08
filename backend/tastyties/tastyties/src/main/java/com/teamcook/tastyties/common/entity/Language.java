package com.teamcook.tastyties.common.entity;

import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.Set;

@Entity
@Getter
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "language")
    private Set<User> user;

    @Column(nullable = false, unique = true)
    private String alpha2;
    @Column(nullable = false, unique = true)
    private String english;
    @Column(nullable = false, unique = true)
    private String korean;
}
