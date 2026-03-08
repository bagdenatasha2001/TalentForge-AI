package com.talentforge.controller;

import com.talentforge.dto.ApiResponse;
import com.talentforge.entity.User;
import com.talentforge.service.ForgeAiService;
import com.talentforge.service.JdService;
import com.talentforge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
public class LearningController {

    private final ForgeAiService forgeAiService;
    private final JdService jdService;
    private final UserService userService;

    @PostMapping("/generate-questions")
    public ResponseEntity<ApiResponse<?>> generateQuestions(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        Long jdRecordId = Long.valueOf(body.get("jdRecordId").toString());

        var jdRecord = jdService.getJdById(jdRecordId, user.getId());

        Map<String, Object> payload = new HashMap<>(body);
        payload.put("user_id", user.getId());
        payload.put("jd_record_id", jdRecordId);
        payload.put("jd_text", jdRecord.getJdText());
        payload.put("required_skills", jdRecord.getRequiredSkills());
        payload.put("core_responsibilities", jdRecord.getCoreResponsibilities());
        payload.put("candidate_skills", user.getTechnicalSkills());
        payload.put("candidate_role", user.getCurrentRole());

        var result = forgeAiService.generateQuestions(user.getId(), jdRecordId, payload);
        return ResponseEntity.ok(ApiResponse.success("Questions generated.", result));
    }

    @PostMapping("/generate-content")
    public ResponseEntity<ApiResponse<?>> generateContent(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        Long jdRecordId = Long.valueOf(body.get("jdRecordId").toString());

        var jdRecord = jdService.getJdById(jdRecordId, user.getId());

        Map<String, Object> payload = new HashMap<>(body);
        payload.put("user_id", user.getId());
        payload.put("jd_record_id", jdRecordId);
        payload.put("jd_text", jdRecord.getJdText());
        payload.put("job_title", jdRecord.getJobTitle() != null ? jdRecord.getJobTitle() : "");
        payload.put("required_skills", jdRecord.getRequiredSkills());

        var result = forgeAiService.generateLearningContent(user.getId(), jdRecordId, payload);
        return ResponseEntity.ok(ApiResponse.success("Learning content generated.", result));
    }

    @PostMapping("/interrogate")
    public ResponseEntity<ApiResponse<?>> interrogate(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());

        Map<String, Object> payload = new HashMap<>(body);
        payload.put("user_id", user.getId());
        payload.put("candidate_skills", user.getTechnicalSkills());
        payload.put("candidate_role", user.getCurrentRole());

        var result = forgeAiService.generateInterrogation(user.getId(), payload);
        return ResponseEntity.ok(ApiResponse.success("Interrogation generated.", result));
    }

    @PostMapping("/generate-mcq")
    public ResponseEntity<ApiResponse<?>> generateMcq(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());
        Long jdRecordId = Long.valueOf(body.get("jdRecordId").toString());

        var jdRecord = jdService.getJdById(jdRecordId, user.getId());

        Map<String, Object> payload = new HashMap<>(body);
        payload.put("user_id", user.getId());
        payload.put("jd_text", jdRecord.getJdText());
        payload.put("required_skills", jdRecord.getRequiredSkills());
        payload.put("candidate_skills", user.getTechnicalSkills());

        var result = forgeAiService.generateMcq(user.getId(), payload);
        return ResponseEntity.ok(ApiResponse.success("MCQ test generated.", result));
    }

    @PostMapping("/detect-weak")
    public ResponseEntity<ApiResponse<?>> detectWeak(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());

        Map<String, Object> payload = new HashMap<>(body);
        payload.put("user_id", user.getId());
        payload.put("candidate_skills", user.getTechnicalSkills());

        var result = forgeAiService.detectWeakAreas(user.getId(), payload);
        return ResponseEntity.ok(ApiResponse.success("Weak areas detected.", result));
    }

    @PostMapping("/reinforce")
    public ResponseEntity<ApiResponse<?>> reinforce(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User authUser) {
        User user = userService.getUserByEmail(authUser.getEmail());

        // Hydrate with JD context if jdRecordId is provided
        if (body.containsKey("jd_record_id") || body.containsKey("jdRecordId")) {
            Object idObj = body.get("jd_record_id") != null ? body.get("jd_record_id") : body.get("jdRecordId");
            Long jdRecordId = Long.valueOf(idObj.toString());
            var jdRecord = jdService.getJdById(jdRecordId, user.getId());
            body.put("jd_text", jdRecord.getJdText());
        }

        Map<String, Object> payload = new HashMap<>(body);
        payload.put("user_id", user.getId());
        payload.put("candidate_skills", user.getTechnicalSkills());

        var result = forgeAiService.generateReinforcement(user.getId(), payload);
        return ResponseEntity.ok(ApiResponse.success("Reinforcement content generated.", result));
    }
}
