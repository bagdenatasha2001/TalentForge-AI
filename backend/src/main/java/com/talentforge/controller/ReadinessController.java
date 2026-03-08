package com.talentforge.controller;

import com.talentforge.dto.ApiResponse;
import com.talentforge.entity.ReadinessScore;
import com.talentforge.entity.User;
import com.talentforge.service.ForgeAiService;
import com.talentforge.service.JdService;
import com.talentforge.service.ReadinessService;
import com.talentforge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/readiness")
@RequiredArgsConstructor
public class ReadinessController {

    private final ReadinessService readinessService;
    private final ForgeAiService forgeAiService;
    private final JdService jdService;
    private final UserService userService;

    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<?>> calculate(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());

        Long jdRecordId = body.containsKey("jdRecordId")
                ? Long.valueOf(body.get("jdRecordId").toString())
                : null;

        double mcqScore = toDouble(body.get("mcqScore"));
        double codingScore = toDouble(body.get("codingScore"));
        double jdMatchScore = toDouble(body.get("jdMatchScore"));
        double learningDepthScore = toDouble(body.get("learningDepthScore"));

        var jdRecord = jdRecordId != null ? jdService.getJdById(jdRecordId, user.getId()) : null;

        ReadinessScore score = readinessService.calculateAndSave(user, jdRecord,
                mcqScore, codingScore, jdMatchScore, learningDepthScore);

        return ResponseEntity.ok(ApiResponse.success("Readiness score calculated.", score));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<?>> getLatest(@AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Latest readiness score.",
                readinessService.getLatestScore(user.getId()).orElse(null)));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<?>> getHistory(@AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Score history.",
                readinessService.getScoreHistory(user.getId())));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<?>> getDashboard(@AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary.",
                readinessService.getDashboardSummary(user.getId())));
    }

    @PostMapping("/career-insights")
    public ResponseEntity<ApiResponse<?>> getCareerInsights(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());

        body.put("user_id", user.getId());
        body.put("current_role", user.getCurrentRole());
        body.put("technical_skills", user.getTechnicalSkills());
        body.put("preferred_role", user.getPreferredRole());
        body.put("years_experience", user.getYearsOfExperience());

        var result = forgeAiService.generateCareerInsights(user.getId(), body);
        return ResponseEntity.ok(ApiResponse.success("Career insights generated.", result));
    }

    private double toDouble(Object obj) {
        if (obj == null)
            return 0.0;
        try {
            return Double.parseDouble(obj.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
