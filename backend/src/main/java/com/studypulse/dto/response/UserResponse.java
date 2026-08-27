package com.studypulse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String university;
    private String degree;
    private Integer academicYear;
    private Integer dailyTargetMinutes;
    private String preferredStudyStartTime;
    private String preferredStudyEndTime;
    private String theme;
    private Boolean notificationsEnabled;
}
