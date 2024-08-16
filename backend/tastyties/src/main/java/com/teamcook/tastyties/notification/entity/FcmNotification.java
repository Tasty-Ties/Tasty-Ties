package com.teamcook.tastyties.notification.entity;

import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FcmNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;
    private String title;
    private String body;
    private LocalDateTime createTime;
    private boolean isRead = Boolean.FALSE;

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}
