package com.teamcook.tastyties.common.entity;

import com.teamcook.tastyties.shared.entity.UserAndCountry;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
public class Country {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  private String alpha2;
  private String englishName;
  private String koreanName;
  private String countryImageUrl;

  @OneToMany(mappedBy = "country")
  private Set<User> user;

  @OneToMany(mappedBy = "country")
  private Set<UserAndCountry> userAndCountries = new HashSet<>();
}

//CREATE TABLE Country (
//        id INT AUTO_INCREMENT PRIMARY KEY,
//        alpha2 CHAR(2) NOT NULL,
//english_name VARCHAR(100) NOT NULL,
//korean_name VARCHAR(100) NOT NULL
//);
