package com.talentforge.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jd_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JdRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String jdText;

    private String jobTitle;
    private String company;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills; // JSON array as string

    @Column(columnDefinition = "TEXT")
    private String requiredTools;

    @Column(columnDefinition = "TEXT")
    private String coreResponsibilities;

    private String experienceLevel;

    @Column(columnDefinition = "TEXT")
    private String softSkills;

    private Double skillMatchScore;
    private Double responsibilityMatchScore;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JdStatus status = JdStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdDate;

    public enum JdStatus {
        PENDING, ANALYZED, COMPLETED
    }
}
