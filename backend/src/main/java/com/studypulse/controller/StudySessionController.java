package com.studypulse.controller;

import com.studypulse.dto.request.StudySessionRequest;
import com.studypulse.dto.response.StudySessionResponse;
import com.studypulse.entity.User;
import com.studypulse.service.StudySessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-sessions")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService studySessionService;

    @PostMapping
    public ResponseEntity<StudySessionResponse> createSession(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody StudySessionRequest request) {
        return ResponseEntity.ok(studySessionService.createSession(user, request));
    }

    @GetMapping
    public ResponseEntity<List<StudySessionResponse>> getUserSessions(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studySessionService.getUserSessions(user));
    }

    @GetMapping("/today")
    public ResponseEntity<List<StudySessionResponse>> getTodaySessions(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studySessionService.getTodaySessions(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudySessionResponse> updateSession(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody StudySessionRequest request) {
        return ResponseEntity.ok(studySessionService.updateSession(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        studySessionService.deleteSession(user, id);
        return ResponseEntity.noContent().build();
    }
}
