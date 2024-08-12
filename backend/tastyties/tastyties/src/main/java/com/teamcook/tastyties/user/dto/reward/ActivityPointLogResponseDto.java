package com.teamcook.tastyties.user.dto.reward;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityPointLogResponseDto {
    private LocalDateTime transactionDate;
    private double amount;
    private double totalPoint;
    private String description;

    @QueryProjection

    public ActivityPointLogResponseDto(LocalDateTime transactionDate, double amount, double totalPoint, String description) {
        this.transactionDate = transactionDate;
        this.amount = amount;
        this.totalPoint = totalPoint;
        this.description = description;
    }
}
