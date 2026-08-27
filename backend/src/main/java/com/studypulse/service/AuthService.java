package com.studypulse.service;

import com.studypulse.dto.request.AuthRequest;
import com.studypulse.dto.request.RegisterRequest;
import com.studypulse.dto.response.AuthResponse;
import com.studypulse.entity.Role;
import com.studypulse.entity.User;
import com.studypulse.entity.UserPreference;
import com.studypulse.repository.UserPreferenceRepository;
import com.studypulse.repository.UserRepository;
import com.studypulse.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .university(request.getUniversity())
                .degree(request.getDegree())
                .academicYear(request.getAcademicYear())
                .build();
        
        userRepository.save(user);
        
        // Create default user preferences
        UserPreference prefs = UserPreference.builder()
            .user(user)
            .dailyTargetMinutes(120)
            .theme("pink")
            .notificationsEnabled(true)
            .build();
        userPreferenceRepository.save(prefs);

        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
