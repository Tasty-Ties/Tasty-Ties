package com.teamcook.tastyties.common.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Country {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  private String alpha2;
  private String englishName;
  private String koreanName;
}

//CREATE TABLE Country (
//        id INT AUTO_INCREMENT PRIMARY KEY,
//        alpha2 CHAR(2) NOT NULL,
//english_name VARCHAR(100) NOT NULL,
//korean_name VARCHAR(100) NOT NULL
//);
