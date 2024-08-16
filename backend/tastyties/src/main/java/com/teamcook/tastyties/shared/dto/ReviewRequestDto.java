package com.teamcook.tastyties.shared.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class ReviewRequestDto {
    String uuid;
    String comment;
}
