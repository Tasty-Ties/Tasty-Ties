package com.teamcook.tastyties.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
public class UserStatistics {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Setter
    private User user;

    private int classesHosted;
    private int classesAttended;

    public void updateStatistics(boolean isHost) {
        if (isHost) {
            this.classesHosted++;
        } else {
            this.classesAttended++;
        }
    }
}
