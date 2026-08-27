package com.studypulse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryResponse {
    private String todaysStudyTime;
    private String weeklyStudyTime;
    private Integer productivityScore;
    private Integer studyStreak;
}
