package com.teamcook.tastytieschat.chat.entity;

import com.teamcook.tastytieschat.chat.dto.ChatRoomRequestDTO;
import com.teamcook.tastytieschat.chat.dto.UserDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
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
    private List<UserDTO> users;
    @CreatedDate
    private Instant createdTime;
    private boolean isDeleted;

    public ChatRoom(String title, UserDTO userDto) {
        this.title = title;
        this.users = new ArrayList<>();
        this.isDeleted = false;

        userDto.setEnteredTime(Instant.now());

        users.add(userDto);
    }

    public boolean isContainedUser(int userId) {
        for (UserDTO userDto : users) {
            if (userId == userDto.getId()) {
                return true;
            }
        }

        return false;
    }

    public String removeUser(int userId) {
        for (UserDTO user : users) {
            if (userId == user.getId()) {
                String removedUserNickname = user.getNickname();
                users.remove(user);
                return removedUserNickname;
            }
        }

        return null;
    }

    public UserDTO getUser(int userId) {
        for (UserDTO userDto : users) {
            if (userId == userDto.getId()) {
                return userDto;
            }
        }

        return null;
    }

    public Set<String> getLanguages() {
        Set<String> languages = new HashSet<>();
        for (UserDTO userDto : users) {
            languages.add(userDto.getLanguage());
        }

        return languages;
    }

}
