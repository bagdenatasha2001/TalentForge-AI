package com.talentforge.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal
    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private LocalDate dateOfBirth;

    // Education
    private String degree;
    private String institution;
    private Integer graduationYear;
    private String major;

    // Professional
    @Column(name = "current_job_role")
    private String currentRole;
    private String company;
    private Double yearsOfExperience;

    @Column(columnDefinition = "TEXT")
    private String pastRoles;

    // Skills
    @Column(columnDefinition = "TEXT")
    private String technicalSkills;

    @Column(columnDefinition = "TEXT")
    private String softSkills;

    // Preferences
    private String preferredRole;
    private String preferredLocation;

    @Column(columnDefinition = "TEXT")
    private String careerGoal;

    // Auth
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private Role role;

    @Builder.Default
    private boolean verified = false;

    private String otpCode;
    private LocalDateTime otpExpiresAt;

    // Consent
    @Builder.Default
    private boolean dataPrivacyAgreed = false;

    @Builder.Default
    private boolean aiProcessingConsent = false;

    // Timestamps
    @CreationTimestamp
    private LocalDateTime createdDate;

    @UpdateTimestamp
    private LocalDateTime updatedDate;

    public enum Role {
        CANDIDATE, ADMIN
    }
}
