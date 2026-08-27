package com.studypulse.service;

import com.studypulse.dto.request.GoalRequest;
import com.studypulse.dto.response.GoalResponse;
import com.studypulse.entity.Goal;
import com.studypulse.entity.GoalStatus;
import com.studypulse.entity.Subject;
import com.studypulse.entity.User;
import com.studypulse.repository.GoalRepository;
import com.studypulse.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final SubjectRepository subjectRepository;

    public GoalResponse createGoal(User user, GoalRequest request) {
        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId()).orElse(null);
        }

        Goal goal = Goal.builder()
                .user(user)
                .subject(subject)
                .title(request.getTitle())
                .description(request.getDescription())
                .targetMinutes(request.getTargetMinutes())
                .deadline(request.getDeadline())
                .build();

        return mapToResponse(goalRepository.save(goal));
    }

    public List<GoalResponse> getUserGoals(User user) {
        return goalRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public GoalResponse getGoal(User user, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to view this goal");
        }
        return mapToResponse(goal);
    }

    public GoalResponse updateGoal(User user, Long goalId, GoalRequest request) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify this goal");
        }
        
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId()).orElse(null);
            goal.setSubject(subject);
        }
        if (request.getTitle() != null) goal.setTitle(request.getTitle());
        if (request.getDescription() != null) goal.setDescription(request.getDescription());
        if (request.getTargetMinutes() != null) goal.setTargetMinutes(request.getTargetMinutes());
        if (request.getDeadline() != null) goal.setDeadline(request.getDeadline());

        return mapToResponse(goalRepository.save(goal));
    }

    public void deleteGoal(User user, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify this goal");
        }
        goalRepository.delete(goal);
    }

    public GoalResponse updateGoalStatus(User user, Long goalId, String status) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify this goal");
        }

        goal.setStatus(GoalStatus.valueOf(status));
        return mapToResponse(goalRepository.save(goal));
    }

    private GoalResponse mapToResponse(Goal goal) {
        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .subjectId(goal.getSubject() != null ? goal.getSubject().getId() : null)
                .subjectName(goal.getSubject() != null ? goal.getSubject().getName() : null)
                .description(goal.getDescription())
                .targetMinutes(goal.getTargetMinutes())
                .completedMinutes(goal.getCompletedMinutes())
                .deadline(goal.getDeadline())
                .status(goal.getStatus().name())
                .build();
    }
}
