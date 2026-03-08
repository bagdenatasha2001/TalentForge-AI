package com.talentforge.controller;

import com.talentforge.dto.ApiResponse;
import com.talentforge.repository.AiLogRepository;
import com.talentforge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final AiLogRepository aiLogRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("All users.", userService.getAllUsers()));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted.", null));
    }

    @GetMapping("/ai-logs")
    public ResponseEntity<ApiResponse<?>> getAiLogs() {
        return ResponseEntity.ok(ApiResponse.success("AI logs.", aiLogRepository.findTop50ByOrderByCreatedAtDesc()));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<?>> getAnalytics() {
        long totalUsers = userService.getAllUsers().size();
        long aiInteractions = aiLogRepository.count();

        return ResponseEntity.ok(ApiResponse.success("Analytics data.",
                java.util.Map.of(
                        "totalUsers", totalUsers,
                        "aiInteractions", aiInteractions)));
    }
}
