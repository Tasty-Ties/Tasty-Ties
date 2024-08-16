package com.teamcook.tastyties.short_form.repository;

import com.teamcook.tastyties.short_form.entity.ShortFormTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShortFormTagRepository extends JpaRepository<ShortFormTag, Integer> {
    Optional<ShortFormTag> findByShortFormTagName(String shortFormTagName);
}
