package com.talentforge.service;

import com.talentforge.entity.JdRecord;
import com.talentforge.entity.ReadinessScore;
import com.talentforge.entity.User;
import com.talentforge.repository.ReadinessScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReadinessService {

    private final ReadinessScoreRepository readinessScoreRepository;

    @Transactional
    public ReadinessScore calculateAndSave(User user, JdRecord jdRecord,
            Double mcqScore, Double codingScore,
            Double jdMatchScore, Double learningDepthScore) {
        // Weighted formula: MCQ*0.35 + Coding*0.30 + JDMatch*0.20 + Learning*0.15
        double finalScore = (mcqScore * 0.35) + (codingScore * 0.30)
                + (jdMatchScore * 0.20) + (learningDepthScore * 0.15);
        finalScore = Math.min(100.0, Math.max(0.0, finalScore));

        ReadinessScore.ReadinessLevel level = ReadinessScore.classify(finalScore);

        ReadinessScore score = ReadinessScore.builder()
                .user(user)
                .jdRecord(jdRecord)
                .mcqScore(mcqScore)
                .codingScore(codingScore)
                .jdMatchScore(jdMatchScore)
                .learningDepthScore(learningDepthScore)
                .finalScore(finalScore)
                .level(level)
                .build();

        ReadinessScore saved = readinessScoreRepository.save(score);
        log.info("Readiness score calculated for user {}: {} ({})", user.getId(), finalScore, level);
        return saved;
    }

    public Optional<ReadinessScore> getLatestScore(Long userId) {
        return readinessScoreRepository.findFirstByUserIdOrderByCreatedDateDesc(userId);
    }

    public List<ReadinessScore> getScoreHistory(Long userId) {
        return readinessScoreRepository.findTop10ByUserIdOrderByCreatedDateDesc(userId);
    }

    public Map<String, Object> getDashboardSummary(Long userId) {
        Optional<ReadinessScore> latest = getLatestScore(userId);
        List<ReadinessScore> history = getScoreHistory(userId);

        Map<String, Object> summary = new HashMap<>();
        if (latest.isPresent()) {
            ReadinessScore s = latest.get();
            summary.put("finalScore", s.getFinalScore());
            summary.put("level", s.getLevel().name());
            summary.put("mcqScore", s.getMcqScore());
            summary.put("codingScore", s.getCodingScore());
            summary.put("jdMatchScore", s.getJdMatchScore());
            summary.put("learningDepthScore", s.getLearningDepthScore());
        } else {
            summary.put("finalScore", 0);
            summary.put("level", "NOT_STARTED");
        }

        summary.put("history", history.stream().map(s -> Map.of(
                "date", s.getCreatedDate().toString(),
                "score", s.getFinalScore(),
                "level", s.getLevel().name())).toList());

        return summary;
    }
}
