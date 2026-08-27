package com.studypulse.service;

import com.studypulse.dto.request.StudyPlanItemRequest;
import com.studypulse.dto.request.StudyPlanRequest;
import com.studypulse.dto.response.StudyPlanItemResponse;
import com.studypulse.dto.response.StudyPlanResponse;
import com.studypulse.entity.*;
import com.studypulse.repository.StudyPlanItemRepository;
import com.studypulse.repository.StudyPlanRepository;
import com.studypulse.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final StudyPlanItemRepository studyPlanItemRepository;
    private final SubjectRepository subjectRepository;

    public StudyPlanResponse createPlan(User user, StudyPlanRequest request) {
        StudyPlan plan = StudyPlan.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        return mapToResponse(studyPlanRepository.save(plan));
    }

    public List<StudyPlanResponse> getUserPlans(User user) {
        return studyPlanRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudyPlanResponse updatePlan(User user, Long planId, StudyPlanRequest request) {
        StudyPlan plan = studyPlanRepository.findById(planId).orElseThrow();
        if (!plan.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        
        if (request.getTitle() != null) plan.setTitle(request.getTitle());
        if (request.getDescription() != null) plan.setDescription(request.getDescription());
        if (request.getStartDate() != null) plan.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) plan.setEndDate(request.getEndDate());
        
        return mapToResponse(studyPlanRepository.save(plan));
    }

    public void deletePlan(User user, Long planId) {
        StudyPlan plan = studyPlanRepository.findById(planId).orElseThrow();
        if (!plan.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        studyPlanRepository.delete(plan);
    }

    public StudyPlanResponse addItem(User user, Long planId, StudyPlanItemRequest request) {
        StudyPlan plan = studyPlanRepository.findById(planId).orElseThrow();
        if (!plan.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId()).orElse(null);
        }

        StudyPlanItem item = StudyPlanItem.builder()
                .studyPlan(plan)
                .subject(subject)
                .taskTitle(request.getTaskTitle())
                .plannedMinutes(request.getPlannedMinutes())
                .scheduledDate(request.getScheduledDate())
                .build();
        
        studyPlanItemRepository.save(item);
        return mapToResponse(studyPlanRepository.findById(planId).get());
    }

    public StudyPlanResponse markItemComplete(User user, Long planId, Long itemId) {
        StudyPlanItem item = studyPlanItemRepository.findById(itemId).orElseThrow();
        if (!item.getStudyPlan().getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        
        item.setStatus(ItemStatus.COMPLETED);
        if (item.getPlannedMinutes() != null && item.getCompletedMinutes() == 0) {
            item.setCompletedMinutes(item.getPlannedMinutes());
        }
        studyPlanItemRepository.save(item);
        
        return mapToResponse(studyPlanRepository.findById(planId).get());
    }
    
    public void deleteItem(User user, Long planId, Long itemId) {
        StudyPlanItem item = studyPlanItemRepository.findById(itemId).orElseThrow();
        if (!item.getStudyPlan().getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        studyPlanItemRepository.delete(item);
    }

    private StudyPlanResponse mapToResponse(StudyPlan plan) {
        List<StudyPlanItemResponse> items = plan.getItems() != null ? plan.getItems().stream()
                .map(i -> StudyPlanItemResponse.builder()
                        .id(i.getId())
                        .subjectId(i.getSubject() != null ? i.getSubject().getId() : null)
                        .subjectName(i.getSubject() != null ? i.getSubject().getName() : null)
                        .taskTitle(i.getTaskTitle())
                        .plannedMinutes(i.getPlannedMinutes())
                        .completedMinutes(i.getCompletedMinutes())
                        .scheduledDate(i.getScheduledDate())
                        .status(i.getStatus().name())
                        .build())
                .collect(Collectors.toList()) : List.of();

        return StudyPlanResponse.builder()
                .id(plan.getId())
                .title(plan.getTitle())
                .description(plan.getDescription())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .status(plan.getStatus().name())
                .items(items)
                .build();
    }
}
