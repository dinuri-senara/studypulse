package com.studypulse.controller;

import com.studypulse.dto.response.DashboardSummaryResponse;
import com.studypulse.entity.User;
import com.studypulse.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getSummary(user));
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<java.util.Map<String, Object>>> getWeeklyStudyTime(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getWeeklyStudyTime(user));
    }

    @GetMapping("/productivity")
    public ResponseEntity<List<java.util.Map<String, Object>>> getProductivityTrend(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getProductivityTrend(user));
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<java.util.Map<String, Object>>> getSubjectPerformance(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getSubjectPerformance(user));
    }

    @GetMapping("/streak")
    public ResponseEntity<java.util.Map<String, Object>> getStreakStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getStreakStats(user));
    }

    @GetMapping("/productive-hours")
    public ResponseEntity<List<java.util.Map<String, Object>>> getProductiveHours(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getProductiveHours(user));
    }
}
