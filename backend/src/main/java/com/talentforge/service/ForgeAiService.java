package com.talentforge.service;

import com.talentforge.document.AiLog;
import com.talentforge.repository.AiLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForgeAiService {

    private final WebClient aiWebClient;
    private final AiLogRepository aiLogRepository;

    public Map<String, Object> extractSkills(Long userId, String jdText, String jobTitle) {
        long start = System.currentTimeMillis();
        try {
            Map<String, Object> result = aiWebClient.post()
                    .uri("/api/ai/extract-skills")
                    .bodyValue(Map.of("jd_text", jdText, "job_title", jobTitle != null ? jobTitle : ""))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            logAiCall(userId, "/api/ai/extract-skills", "JD skill extraction", true, null,
                    System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("AI extract-skills error: {}", e.getMessage());
            logAiCall(userId, "/api/ai/extract-skills", "JD skill extraction", false, e.getMessage(),
                    System.currentTimeMillis() - start);
            throw new RuntimeException("AI Engine unavailable: " + e.getMessage());
        }
    }

    public Map<String, Object> generateQuestions(Long userId, Long jdRecordId, Map<String, Object> payload) {
        long start = System.currentTimeMillis();
        try {
            Map<String, Object> result = aiWebClient.post()
                    .uri("/api/ai/generate-questions")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            logAiCall(userId, "/api/ai/generate-questions", "Learning question generation", true, null,
                    System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("AI generate-questions error: {}", e.getMessage());
            logAiCall(userId, "/api/ai/generate-questions", "Question generation", false, e.getMessage(),
                    System.currentTimeMillis() - start);
            throw new RuntimeException("AI Engine error: " + e.getMessage());
        }
    }

    public Map<String, Object> generateLearningContent(Long userId, Long jdRecordId, Map<String, Object> payload) {
        long start = System.currentTimeMillis();
        try {
            Map<String, Object> result = aiWebClient.post()
                    .uri("/api/ai/generate-content")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            logAiCall(userId, "/api/ai/generate-content", "Learning content generation", true, null,
                    System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("AI generate-content error: {}", e.getMessage());
            logAiCall(userId, "/api/ai/generate-content", "Learning content", false, e.getMessage(),
                    System.currentTimeMillis() - start);
            throw new RuntimeException("AI Engine error: " + e.getMessage());
        }
    }

    public Map<String, Object> generateInterrogation(Long userId, Map<String, Object> payload) {
        long start = System.currentTimeMillis();
        try {
            Map<String, Object> result = aiWebClient.post()
                    .uri("/api/ai/interrogate")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            logAiCall(userId, "/api/ai/interrogate", "Strict interrogation", true, null,
                    System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("AI interrogate error: {}", e.getMessage());
            logAiCall(userId, "/api/ai/interrogate", "Interrogation", false, e.getMessage(),
                    System.currentTimeMillis() - start);
            throw new RuntimeException("AI Engine error: " + e.getMessage());
        }
    }

    public Map<String, Object> generateMcq(Long userId, Map<String, Object> payload) {
        long start = System.currentTimeMillis();
        try {
            Map<String, Object> result = aiWebClient.post()
                    .uri("/api/ai/generate-mcq")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            logAiCall(userId, "/api/ai/generate-mcq", "Adaptive MCQ generation", true, null,
                    System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("AI generate-mcq error: {}", e.getMessage());
            logAiCall(userId, "/api/ai/generate-mcq", "MCQ generation", false, e.getMessage(),
                    System.currentTimeMillis() - start);
            throw new RuntimeException("AI Engine error: " + e.getMessage());
        }
    }

    public Map<String, Object> detectWeakAreas(Long userId, Map<String, Object> payload) {
        long start = System.currentTimeMillis();
        try {
            Map<String, Object> result = aiWebClient.post()
                    .uri("/api/ai/detect-weak")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            logAiCall(userId, "/api/ai/detect-weak", "Weak area detection", true, null,
                    System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("AI detect-weak error: {}", e.getMessage());
            logAiCall(userId, "/api/ai/detect-weak", "Weak detection", false, e.getMessage(),
                    System.currentTimeMillis() - start);
            throw new RuntimeException("AI Engine error: " + e.getMessage());
        }
    }

    public Map<String, Object> generateReinforcement(Long userId, Map<String, Object> payload) {
        long start = System.currentTimeMillis();
        try {
            Map<String, Object> result = aiWebClient.post()
                    .uri("/api/ai/reinforce")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            logAiCall(userId, "/api/ai/reinforce", "Reinforcement generation", true, null,
                    System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("AI reinforce error: {}", e.getMessage());
            logAiCall(userId, "/api/ai/reinforce", "Reinforcement", false, e.getMessage(),
                    System.currentTimeMillis() - start);
            throw new RuntimeException("AI Engine error: " + e.getMessage());
        }
    }

    public Map<String, Object> generateCareerInsights(Long userId, Map<String, Object> payload) {
        long start = System.currentTimeMillis();
        try {
            Map<String, Object> result = aiWebClient.post()
                    .uri("/api/ai/career-insights")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            logAiCall(userId, "/api/ai/career-insights", "Career insights", true, null,
                    System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("AI career-insights error: {}", e.getMessage());
            logAiCall(userId, "/api/ai/career-insights", "Career insights", false, e.getMessage(),
                    System.currentTimeMillis() - start);
            throw new RuntimeException("AI Engine error: " + e.getMessage());
        }
    }

    private void logAiCall(Long userId, String endpoint, String summary, boolean success,
            String error, long processingMs) {
        try {
            AiLog log = AiLog.builder()
                    .userId(userId)
                    .endpoint(endpoint)
                    .requestSummary(summary)
                    .model("gemini-2.0-flash")
                    .success(success)
                    .errorMessage(error)
                    .processingTimeMs(processingMs)
                    .createdAt(LocalDateTime.now())
                    .build();
            aiLogRepository.save(log);
        } catch (Exception ex) {
            // Non-critical logging failure
        }
    }
}
