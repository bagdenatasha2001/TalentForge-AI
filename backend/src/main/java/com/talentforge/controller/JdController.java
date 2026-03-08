package com.talentforge.controller;

import com.talentforge.dto.ApiResponse;
import com.talentforge.entity.JdRecord;
import com.talentforge.entity.User;
import com.talentforge.service.JdService;
import com.talentforge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jd")
@RequiredArgsConstructor
public class JdController {

    private final JdService jdService;
    private final UserService userService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<?>> analyzeJd(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        String jdText = body.get("jdText");
        String jobTitle = body.getOrDefault("jobTitle", "");

        if (jdText == null || jdText.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Job description text is required."));
        }

        JdRecord record = jdService.analyzeJd(user, jdText, jobTitle);
        return ResponseEntity.ok(ApiResponse.success("JD analyzed successfully.", record));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<?>> getHistory(@AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success("JD history fetched.",
                jdService.getUserJdHistory(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getJdById(
            @PathVariable Long id,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        JdRecord record = jdService.getJdById(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("JD record fetched.", record));
    }
}
