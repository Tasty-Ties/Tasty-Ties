package com.teamcook.tastyties.shared.repository;

import com.teamcook.tastyties.common.entity.Country;
import com.teamcook.tastyties.user.entity.User;

public interface UserAndCountryCustomRepository {
    boolean alreadyCollected(User user, Country country);
}
