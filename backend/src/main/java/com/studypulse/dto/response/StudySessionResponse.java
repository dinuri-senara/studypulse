package com.studypulse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudySessionResponse {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String sessionType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private Integer productivityRating;
    private String notes;
    private String sessionStatus;
}
