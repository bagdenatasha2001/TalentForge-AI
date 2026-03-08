package com.talentforge.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "readiness_scores")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadinessScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jd_record_id")
    private JdRecord jdRecord;

    // Component scores (0-100)
    private Double mcqScore;
    private Double codingScore;
    private Double jdMatchScore;
    private Double learningDepthScore;

    // Weighted final score: MCQ*0.35 + Coding*0.30 + JDMatch*0.20 + Learning*0.15
    private Double finalScore;

    @Enumerated(EnumType.STRING)
    private ReadinessLevel level;

    @Column(columnDefinition = "TEXT")
    private String skillBreakdown; // JSON

    @Column(columnDefinition = "TEXT")
    private String weakSkills; // JSON

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @CreationTimestamp
    private LocalDateTime createdDate;

    public enum ReadinessLevel {
        NOT_READY, IMPROVING, INTERVIEW_READY, HIGHLY_COMPETITIVE
    }

    public static ReadinessLevel classify(double score) {
        if (score < 40)
            return ReadinessLevel.NOT_READY;
        if (score < 60)
            return ReadinessLevel.IMPROVING;
        if (score < 80)
            return ReadinessLevel.INTERVIEW_READY;
        return ReadinessLevel.HIGHLY_COMPETITIVE;
    }
}
