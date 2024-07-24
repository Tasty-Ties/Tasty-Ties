package com.b206.tastyties.user.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class UserRegistrationDTO {
    private String username;
    private String password;
    private String nickname;
    private String countryCode;
    private String languageCode;
    private String emailId;
    private String emailDomain;
    private LocalDate birth;

}

