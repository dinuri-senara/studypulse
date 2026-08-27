package com.studypulse.service;

import com.studypulse.dto.request.UserUpdateRequest;
import com.studypulse.dto.response.UserResponse;
import com.studypulse.entity.User;
import com.studypulse.entity.UserPreference;
import com.studypulse.repository.UserPreferenceRepository;
import com.studypulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public UserResponse getUserProfile(User user) {
        UserPreference pref = userPreferenceRepository.findByUserId(user.getId())
                .orElse(UserPreference.builder().user(user).build());
        return mapToResponse(user, pref);
    }

    @Transactional
    public UserResponse updateUserProfile(User user, UserUpdateRequest request) {
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getUniversity() != null) user.setUniversity(request.getUniversity());
        if (request.getDegree() != null) user.setDegree(request.getDegree());
        if (request.getAcademicYear() != null) user.setAcademicYear(request.getAcademicYear());
        userRepository.save(user);

        UserPreference pref = userPreferenceRepository.findByUserId(user.getId())
                .orElse(UserPreference.builder().user(user).build());
        
        if (request.getDailyTargetMinutes() != null) pref.setDailyTargetMinutes(request.getDailyTargetMinutes());
        if (request.getPreferredStudyStartTime() != null) pref.setPreferredStudyStartTime(request.getPreferredStudyStartTime());
        if (request.getPreferredStudyEndTime() != null) pref.setPreferredStudyEndTime(request.getPreferredStudyEndTime());
        if (request.getTheme() != null) pref.setTheme(request.getTheme());
        if (request.getNotificationsEnabled() != null) pref.setNotificationsEnabled(request.getNotificationsEnabled());
        
        userPreferenceRepository.save(pref);

        return mapToResponse(user, pref);
    }

    private UserResponse mapToResponse(User user, UserPreference pref) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .university(user.getUniversity())
                .degree(user.getDegree())
                .academicYear(user.getAcademicYear())
                .dailyTargetMinutes(pref.getDailyTargetMinutes())
                .preferredStudyStartTime(pref.getPreferredStudyStartTime())
                .preferredStudyEndTime(pref.getPreferredStudyEndTime())
                .theme(pref.getTheme())
                .notificationsEnabled(pref.getNotificationsEnabled())
                .build();
    }
}
