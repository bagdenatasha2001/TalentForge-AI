package com.talentforge.controller;

import com.talentforge.dto.ApiResponse;
import com.talentforge.entity.User;
import com.talentforge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getProfile(@AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched.", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<?>> updateProfile(
            @RequestBody Map<String, Object> updates,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        User updated = userService.updateProfile(user.getId(), updates);
        return ResponseEntity.ok(ApiResponse.success("Profile updated.", updated));
    }
}
