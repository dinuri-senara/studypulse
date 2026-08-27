package com.studypulse.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String preferredStudyStartTime; // e.g. "08:00"

    private String preferredStudyEndTime; // e.g. "20:00"

    private Integer dailyTargetMinutes;

    @Builder.Default
    private String theme = "pink";

    @Builder.Default
    private Boolean notificationsEnabled = true;
}
