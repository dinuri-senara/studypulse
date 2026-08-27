package com.studypulse.service;

import com.studypulse.dto.request.StudySessionRequest;
import com.studypulse.dto.response.StudySessionResponse;
import com.studypulse.entity.SessionStatus;
import com.studypulse.entity.StudySession;
import com.studypulse.entity.Subject;
import com.studypulse.entity.User;
import com.studypulse.repository.StudySessionRepository;
import com.studypulse.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final SubjectRepository subjectRepository;

    public StudySessionResponse createSession(User user, StudySessionRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        StudySession session = StudySession.builder()
                .user(user)
                .subject(subject)
                .sessionType(request.getSessionType())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .durationMinutes(request.getDurationMinutes())
                .productivityRating(request.getProductivityRating())
                .notes(request.getNotes())
                .sessionStatus(request.getSessionStatus() != null ? 
                        SessionStatus.valueOf(request.getSessionStatus()) : SessionStatus.COMPLETED)
                .build();

        session = studySessionRepository.save(session);
        return mapToResponse(session);
    }

    public List<StudySessionResponse> getUserSessions(User user) {
        return studySessionRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<StudySessionResponse> getTodaySessions(User user) {
        java.time.LocalDateTime startOfDay = java.time.LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        java.time.LocalDateTime endOfDay = java.time.LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return studySessionRepository.findByUserIdAndStartTimeBetween(user.getId(), startOfDay, endOfDay)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudySessionResponse updateSession(User user, Long id, StudySessionRequest request) {
        StudySession session = studySessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            session.setSubject(subject);
        }
        
        if (request.getSessionType() != null) session.setSessionType(request.getSessionType());
        if (request.getStartTime() != null) session.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) session.setEndTime(request.getEndTime());
        if (request.getDurationMinutes() != null) session.setDurationMinutes(request.getDurationMinutes());
        if (request.getProductivityRating() != null) session.setProductivityRating(request.getProductivityRating());
        if (request.getNotes() != null) session.setNotes(request.getNotes());
        if (request.getSessionStatus() != null) session.setSessionStatus(SessionStatus.valueOf(request.getSessionStatus()));

        return mapToResponse(studySessionRepository.save(session));
    }

    public void deleteSession(User user, Long id) {
        StudySession session = studySessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        studySessionRepository.delete(session);
    }

    private StudySessionResponse mapToResponse(StudySession session) {
        return StudySessionResponse.builder()
                .id(session.getId())
                .subjectId(session.getSubject().getId())
                .subjectName(session.getSubject().getName())
                .sessionType(session.getSessionType())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .durationMinutes(session.getDurationMinutes())
                .productivityRating(session.getProductivityRating())
                .notes(session.getNotes())
                .sessionStatus(session.getSessionStatus().name())
                .build();
    }
}
