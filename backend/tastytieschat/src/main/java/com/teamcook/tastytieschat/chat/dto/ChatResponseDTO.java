package com.teamcook.tastytieschat.chat.dto;

import com.teamcook.tastytieschat.chat.constant.MessageType;

import java.time.LocalDate;
import java.util.Map;

public class ChatResponseDTO {

    private MessageType type;
    private int userId;
    private String userNickname;
    private Map<String, String> messages;
    private LocalDate sentTime;

}
