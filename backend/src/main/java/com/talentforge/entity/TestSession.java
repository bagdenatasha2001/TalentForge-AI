package com.talentforge.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jd_record_id")
    private JdRecord jdRecord;

    @Enumerated(EnumType.STRING)
    private TestType testType;

    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double score;
    private Integer duration; // seconds

    @Column(columnDefinition = "TEXT")
    private String topicBreakdown; // JSON

    @Column(columnDefinition = "TEXT")
    private String weakTopics; // JSON array

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TestStatus status = TestStatus.IN_PROGRESS;

    @CreationTimestamp
    private LocalDateTime createdDate;

    private LocalDateTime completedAt;

    public enum TestType {
        MCQ_CONCEPT, MCQ_SCENARIO, MCQ_CODING, REINFORCEMENT
    }

    public enum TestStatus {
        IN_PROGRESS, COMPLETED, ABANDONED
    }
}
