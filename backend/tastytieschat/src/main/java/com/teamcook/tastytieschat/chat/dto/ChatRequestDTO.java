package com.teamcook.tastytieschat.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.teamcook.tastytieschat.chat.constant.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
public class ChatRequestDTO {

    private int userId;
    private String message;

}
