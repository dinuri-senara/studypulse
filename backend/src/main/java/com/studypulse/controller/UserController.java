package com.studypulse.controller;

import com.studypulse.dto.request.UserUpdateRequest;
import com.studypulse.dto.response.UserResponse;
import com.studypulse.entity.User;
import com.studypulse.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getUserProfile(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(user, request));
    }
}
