package com.teamcook.tastyties.common.repository;

import com.teamcook.tastyties.common.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LanguageRepository extends JpaRepository<Language, Integer> {
    Language findByAlpha2(String alpha2);
}
