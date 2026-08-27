package com.studypulse.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoalRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private Long subjectId;
    private String description;
    private Integer targetMinutes;
    private LocalDateTime deadline;
}
