package com.studypulse.controller;

import com.studypulse.dto.request.StudyPlanItemRequest;
import com.studypulse.dto.request.StudyPlanRequest;
import com.studypulse.dto.response.StudyPlanResponse;
import com.studypulse.entity.User;
import com.studypulse.service.StudyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-plans")
@RequiredArgsConstructor
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    @PostMapping
    public ResponseEntity<StudyPlanResponse> createPlan(
            @AuthenticationPrincipal User user,
            @RequestBody StudyPlanRequest request) {
        return ResponseEntity.ok(studyPlanService.createPlan(user, request));
    }

    @GetMapping
    public ResponseEntity<List<StudyPlanResponse>> getUserPlans(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studyPlanService.getUserPlans(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyPlanResponse> updatePlan(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody StudyPlanRequest request) {
        return ResponseEntity.ok(studyPlanService.updatePlan(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        studyPlanService.deletePlan(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<StudyPlanResponse> addItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody StudyPlanItemRequest request) {
        return ResponseEntity.ok(studyPlanService.addItem(user, id, request));
    }

    @PutMapping("/{id}/items/{itemId}/complete")
    public ResponseEntity<StudyPlanResponse> completeItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(studyPlanService.markItemComplete(user, id, itemId));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<Void> deleteItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long itemId) {
        studyPlanService.deleteItem(user, id, itemId);
        return ResponseEntity.noContent().build();
    }
}
