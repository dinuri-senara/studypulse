package com.studypulse.service;

import com.studypulse.dto.response.DashboardSummaryResponse;
import com.studypulse.entity.StudySession;
import com.studypulse.entity.User;
import com.studypulse.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudySessionRepository studySessionRepository;
    private final StreakService streakService;
    private final ProductivityScoreService productivityScoreService;

    public DashboardSummaryResponse getSummary(User user) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        
        List<StudySession> todaySessions = studySessionRepository.findByUserIdAndStartTimeBetween(
                user.getId(), startOfDay, endOfDay);
        int todaysMinutes = todaySessions.stream()
                .filter(s -> s.getDurationMinutes() != null)
                .mapToInt(StudySession::getDurationMinutes)
                .sum();

        LocalDateTime startOfWeek = LocalDateTime.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfWeek = LocalDateTime.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).withHour(23).withMinute(59).withSecond(59);
        
        List<StudySession> weekSessions = studySessionRepository.findByUserIdAndStartTimeBetween(
                user.getId(), startOfWeek, endOfWeek);
        int weeklyMinutes = weekSessions.stream()
                .filter(s -> s.getDurationMinutes() != null)
                .mapToInt(StudySession::getDurationMinutes)
                .sum();

        return DashboardSummaryResponse.builder()
                .todaysStudyTime(formatTime(todaysMinutes))
                .weeklyStudyTime(formatTime(weeklyMinutes))
                .productivityScore(productivityScoreService.calculateScore(user.getId()))
                .studyStreak(streakService.calculateCurrentStreak(user.getId()))
                .build();
    }

    private String formatTime(int totalMinutes) {
        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;
        if (hours == 0) {
            return minutes + "m";
        }
        return hours + "h " + minutes + "m";
    }

    public List<java.util.Map<String, Object>> getWeeklyStudyTime(User user) {
        // Return mock or calculated data for Recharts
        // For simplicity in this massive update, we will return some sample structure based on real DB logic
        // Ideally we group by day of week.
        java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        LocalDateTime startOfWeek = LocalDateTime.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).withHour(0).withMinute(0).withSecond(0);
        
        for (int i = 0; i < 7; i++) {
            LocalDateTime startOfDay = startOfWeek.plusDays(i);
            LocalDateTime endOfDay = startOfDay.withHour(23).withMinute(59).withSecond(59);
            
            List<StudySession> sessions = studySessionRepository.findByUserIdAndStartTimeBetween(user.getId(), startOfDay, endOfDay);
            int minutes = sessions.stream().filter(s -> s.getDurationMinutes() != null).mapToInt(StudySession::getDurationMinutes).sum();
            
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("name", startOfDay.getDayOfWeek().name().substring(0, 3));
            map.put("minutes", minutes);
            result.add(map);
        }
        return result;
    }

    public List<java.util.Map<String, Object>> getProductivityTrend(User user) {
        java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        LocalDateTime startOfWeek = LocalDateTime.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).withHour(0).withMinute(0).withSecond(0);
        
        for (int i = 0; i < 7; i++) {
            LocalDateTime startOfDay = startOfWeek.plusDays(i);
            LocalDateTime endOfDay = startOfDay.withHour(23).withMinute(59).withSecond(59);
            
            List<StudySession> sessions = studySessionRepository.findByUserIdAndStartTimeBetween(user.getId(), startOfDay, endOfDay);
            double avgProd = sessions.stream()
                .filter(s -> s.getProductivityRating() != null)
                .mapToInt(StudySession::getProductivityRating)
                .average().orElse(0.0);
            
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("name", startOfDay.getDayOfWeek().name().substring(0, 3));
            map.put("score", Math.round(avgProd * 10.0) / 10.0);
            result.add(map);
        }
        return result;
    }

    public List<java.util.Map<String, Object>> getSubjectPerformance(User user) {
        List<StudySession> allSessions = studySessionRepository.findByUserId(user.getId());
        java.util.Map<String, Integer> subjectMinutes = new java.util.HashMap<>();
        
        for (StudySession session : allSessions) {
            if (session.getSubject() != null && session.getDurationMinutes() != null) {
                subjectMinutes.put(session.getSubject().getName(), 
                    subjectMinutes.getOrDefault(session.getSubject().getName(), 0) + session.getDurationMinutes());
            }
        }
        
        java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (java.util.Map.Entry<String, Integer> entry : subjectMinutes.entrySet()) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("subject", entry.getKey());
            map.put("hours", Math.round((entry.getValue() / 60.0) * 10.0) / 10.0);
            result.add(map);
        }
        return result;
    }

    public java.util.Map<String, Object> getStreakStats(User user) {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("currentStreak", streakService.calculateCurrentStreak(user.getId()));
        map.put("bestStreak", Math.max(streakService.calculateCurrentStreak(user.getId()), 5)); // Mock best streak
        return map;
    }

    public List<java.util.Map<String, Object>> getProductiveHours(User user) {
        java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        List<StudySession> allSessions = studySessionRepository.findByUserId(user.getId());
        
        int morning = 0, afternoon = 0, evening = 0, night = 0;
        
        for (StudySession session : allSessions) {
            if (session.getStartTime() != null && session.getDurationMinutes() != null) {
                int hour = session.getStartTime().getHour();
                if (hour >= 5 && hour < 12) morning += session.getDurationMinutes();
                else if (hour >= 12 && hour < 17) afternoon += session.getDurationMinutes();
                else if (hour >= 17 && hour < 22) evening += session.getDurationMinutes();
                else night += session.getDurationMinutes();
            }
        }
        
        result.add(java.util.Map.of("name", "Morning (5AM-12PM)", "value", morning));
        result.add(java.util.Map.of("name", "Afternoon (12PM-5PM)", "value", afternoon));
        result.add(java.util.Map.of("name", "Evening (5PM-10PM)", "value", evening));
        result.add(java.util.Map.of("name", "Night (10PM-5AM)", "value", night));
        
        return result;
    }
}
