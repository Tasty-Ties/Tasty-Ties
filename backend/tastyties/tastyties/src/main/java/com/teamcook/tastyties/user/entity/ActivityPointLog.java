package com.teamcook.tastyties.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ActivityPointLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Setter
    private User user;

    private LocalDateTime transactionDate;
    private double amount;
    private String description;

    public ActivityPointLog(double amount, String description) {
        this.amount = amount;
        this.description = description;
    }

    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
    }
}
