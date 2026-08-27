package com.studypulse.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyPlanRequest {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}
