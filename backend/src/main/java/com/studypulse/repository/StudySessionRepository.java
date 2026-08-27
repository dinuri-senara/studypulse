package com.studypulse.repository;

import com.studypulse.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByUserId(Long userId);
    List<StudySession> findByUserIdAndSubjectId(Long userId, Long subjectId);
    List<StudySession> findByUserIdAndStartTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s WHERE s.user.id = :userId")
    Integer getTotalStudyMinutesByUserId(Long userId);
}
