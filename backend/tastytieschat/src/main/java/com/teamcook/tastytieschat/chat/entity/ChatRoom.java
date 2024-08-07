package com.teamcook.tastytieschat.chat.entity;

import com.teamcook.tastytieschat.chat.dto.UserDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "chatroom")
@NoArgsConstructor
@Getter
@Setter
public class ChatRoom {

    @Id
    private String id;
    private String title;
    private String imageUrl;
    private List<UserDto> users;
    @CreatedDate
    private LocalDateTime createdTime;
    private boolean isDeleted;

    public ChatRoom(String title, String imageUrl, UserDto userDto) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.users = new ArrayList<>();
        this.isDeleted = false;

        userDto.setEnteredTime(LocalDateTime.now());

        users.add(userDto);
    }

    public boolean isContainedUser(int userId) {
        for (UserDto userDto : users) {
            if (userId == userDto.getId()) {
                return true;
            }
        }

        return false;
    }

    public String removeUser(int userId) {
        for (UserDto user : users) {
            if (userId == user.getId()) {
                String removedUserNickname = user.getNickname();
                users.remove(user);
                return removedUserNickname;
            }
        }

        return null;
    }

    public UserDto getUser(int userId) {
        for (UserDto userDto : users) {
            if (userId == userDto.getId()) {
                return userDto;
            }
        }

        return null;
    }

    public Set<UserDto> getListeners(int userId) {
        Set<UserDto> listeners = new HashSet<>();
        for (UserDto userDto : users) {
            if (userId == userDto.getId()) {
                continue;
            }

            listeners.add(userDto);
        }

        return listeners;
    }

    public Set<String> getLanguages() {
        Set<String> languages = new HashSet<>();
        for (UserDto userDto : users) {
            languages.add(userDto.getLanguage());
        }

        return languages;
    }

}
