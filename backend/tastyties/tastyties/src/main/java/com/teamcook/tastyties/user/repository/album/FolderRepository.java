package com.teamcook.tastyties.user.repository.album;

import com.teamcook.tastyties.user.entity.album.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<Folder, Integer> {
}
