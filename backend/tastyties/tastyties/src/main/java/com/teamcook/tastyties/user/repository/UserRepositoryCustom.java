package com.teamcook.tastyties.user.repository;

import com.teamcook.tastyties.user.entity.User;

public interface UserRepositoryCustom {

    public User findUserWithCollectedFlags(Integer userId);
}
