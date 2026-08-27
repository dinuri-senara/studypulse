package com.studypulse.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyPlanItemRequest {
    private Long subjectId;
    private String taskTitle;
    private Integer plannedMinutes;
    private LocalDateTime scheduledDate;
}
