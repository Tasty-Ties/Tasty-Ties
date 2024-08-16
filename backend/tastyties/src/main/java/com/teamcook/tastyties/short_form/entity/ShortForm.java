package com.teamcook.tastyties.short_form.entity;

import com.teamcook.tastyties.shared.entity.ShortFormAndShortFormTag;
import com.teamcook.tastyties.short_form.enums.Category;
import com.teamcook.tastyties.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
public class ShortForm {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shortFormId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;

    @NotNull @Column(nullable = false)
    private String uuid;
    @NotNull @Column(nullable = false)
    private String title;
    @NotNull @Column(nullable = false)
    private String shortFormVideoUrl;

    private LocalDateTime createTime;
    private int hit;
    private boolean isDelete;

    @NotNull @Column(nullable = false)
    private Category category;

    @OneToMany(mappedBy = "shortForm", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShortFormLike> shortFormLikes = new ArrayList<>();

    @OneToMany(mappedBy = "shortForm", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShortFormAndShortFormTag> shortFormAndShortFormTags;

    public ShortForm(User user, String title, String shortFormVideoUrl,
                     Category category) {
        this.user = user;
        this.title = title;
        this.shortFormVideoUrl = shortFormVideoUrl;
        this.category = category;
    }

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        uuid = UUID.randomUUID().toString();
        isDelete = false;
        hit = 0;
    }

    public void addLike(ShortFormLike like) {
        shortFormLikes.add(like);
        like.setShortForm(this);
    }

    public void removeLike(ShortFormLike like) {
        shortFormLikes.remove(like);
        like.setShortForm(null);
    }
}
