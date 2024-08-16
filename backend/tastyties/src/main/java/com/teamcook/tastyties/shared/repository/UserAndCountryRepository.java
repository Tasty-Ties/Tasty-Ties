package com.teamcook.tastyties.shared.repository;

import com.teamcook.tastyties.shared.entity.UserAndCountry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAndCountryRepository extends JpaRepository<UserAndCountry, Integer>, UserAndCountryCustomRepository {

}
