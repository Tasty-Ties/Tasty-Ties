package com.teamcook.tastyties.user.repository.album;

import com.teamcook.tastyties.user.entity.album.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotoRepository extends JpaRepository<Photo, Integer> {
}
