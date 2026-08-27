package com.studypulse.service;

import com.studypulse.entity.StudySession;
import com.studypulse.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final StudySessionRepository studySessionRepository;

    public int calculateCurrentStreak(Long userId) {
        List<StudySession> sessions = studySessionRepository.findByUserId(userId);
        if (sessions.isEmpty()) {
            return 0;
        }

        // Sort by start time descending
        sessions.sort((s1, s2) -> s2.getStartTime().compareTo(s1.getStartTime()));

        int streak = 0;
        LocalDate currentDate = LocalDate.now();
        LocalDate lastSessionDate = sessions.get(0).getStartTime().toLocalDate();

        // If last session is older than yesterday, streak is broken
        if (lastSessionDate.isBefore(currentDate.minusDays(1))) {
            return 0;
        }

        LocalDate tempDate = lastSessionDate;
        for (StudySession session : sessions) {
            LocalDate sessionDate = session.getStartTime().toLocalDate();
            if (sessionDate.equals(tempDate)) {
                // Same day, continue
            } else if (sessionDate.equals(tempDate.minusDays(1))) {
                streak++;
                tempDate = sessionDate;
            } else {
                // Streak broken
                break;
            }
        }
        
        // Add 1 for the most recent valid day found
        return streak + 1;
    }
}
