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
import java.util.List;

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

    public ChatRoom(ChatRoomRequestDTO chatRoomRequestDto) {
        this.title = chatRoomRequestDto.getTitle();
        this.users = new ArrayList<>();
        this.isDeleted = false;

        UserDTO userDto = chatRoomRequestDto.getUser();
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

}
