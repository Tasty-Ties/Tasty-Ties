package com.teamcook.tastyties.common.repository;

import com.teamcook.tastyties.common.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Integer> {
}
