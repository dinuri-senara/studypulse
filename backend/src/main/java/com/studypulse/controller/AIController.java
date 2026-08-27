package com.studypulse.controller;

import com.studypulse.dto.response.AIAdviceResponse;
import com.studypulse.entity.User;
import com.studypulse.service.AIStudyAdvisorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIStudyAdvisorService aiService;

    @GetMapping("/study-advice")
    public ResponseEntity<AIAdviceResponse> getStudyAdvice(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiService.generateStudyAdvice(user));
    }
}
