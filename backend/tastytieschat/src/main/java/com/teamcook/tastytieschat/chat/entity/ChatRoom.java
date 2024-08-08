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

    public boolean isContainedUser(String username) {
        for (UserDto user : users) {
            if (user.getUsername().equals(username)) {
                return true;
            }
        }

        return false;
    }

    public void removeUser(String username) {
        for (UserDto user : users) {
            if (user.getUsername().equals(username)) {
                users.remove(user);
            }
        }
    }

    public UserDto getUser(String username) {
        for (UserDto user : users) {
            if (user.getUsername().equals(username)) {
                return user;
            }
        }

        return null;
    }

    public Set<UserDto> getListeners(String speakerUsername) {
        Set<UserDto> listeners = new HashSet<>();
        for (UserDto user : users) {
            if (user.getUsername().equals(speakerUsername)) {
                continue;
            }

            listeners.add(user);
        }

        return listeners;
    }

    public Set<String> getLanguages() {
        Set<String> languages = new HashSet<>();
        for (UserDto user : users) {
            languages.add(user.getLanguage());
        }

        return languages;
    }

}
