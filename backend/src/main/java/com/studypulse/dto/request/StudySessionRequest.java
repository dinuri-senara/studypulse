package com.studypulse.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudySessionRequest {
    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    private String sessionType;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    private LocalDateTime endTime;
    private Integer durationMinutes;
    private Integer productivityRating;
    private String notes;
    private String sessionStatus;
}
