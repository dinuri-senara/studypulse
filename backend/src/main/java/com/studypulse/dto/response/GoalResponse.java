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
public class GoalResponse {
    private Long id;
    private String title;
    private Long subjectId;
    private String subjectName;
    private String description;
    private Integer targetMinutes;
    private Integer completedMinutes;
    private LocalDateTime deadline;
    private String status;
}
