package com.studypulse.controller;

import com.studypulse.dto.request.GoalRequest;
import com.studypulse.dto.response.GoalResponse;
import com.studypulse.entity.User;
import com.studypulse.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.createGoal(user, request));
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getUserGoals(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(goalService.getUserGoals(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getGoal(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(goalService.getGoal(user, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> updateGoal(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        goalService.deleteGoal(user, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<GoalResponse> completeGoal(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(goalService.updateGoalStatus(user, id, "COMPLETED"));
    }
}
