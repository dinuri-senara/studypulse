package com.studypulse.service;

import com.studypulse.entity.StudySession;
import com.studypulse.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductivityScoreService {

    private final StudySessionRepository studySessionRepository;

    public int calculateScore(Long userId) {
        List<StudySession> sessions = studySessionRepository.findByUserId(userId);
        if (sessions.isEmpty()) {
            return 0;
        }

        double totalScore = 0;
        int validSessions = 0;
        
        for (StudySession session : sessions) {
            if (session.getProductivityRating() != null && session.getProductivityRating() > 0) {
                totalScore += session.getProductivityRating();
                validSessions++;
            }
        }

        if (validSessions == 0) return 0;
        
        // Normalize 1-5 rating to 0-100 percentage
        double averageRating = totalScore / validSessions;
        int percentage = (int) ((averageRating / 5.0) * 100);
        
        // Add a slight boost for having more sessions (consistency) up to max 100
        int finalScore = percentage + Math.min(validSessions, 10);
        return Math.min(finalScore, 100);
    }
}
