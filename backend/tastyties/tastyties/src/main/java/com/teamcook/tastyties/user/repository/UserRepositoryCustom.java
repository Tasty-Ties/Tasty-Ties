package com.teamcook.tastyties.user.repository;

import com.teamcook.tastyties.user.entity.User;

public interface UserRepositoryCustom {

    public User findUserWithCollectedFlags(Integer userId);
    public User findUserWithCollectedFlags(String username);
    public User findUserWithLanguage(String username);



    // 총합 점수에 대해 나의 등수 확인
    public long getMyRank(double score);

}
