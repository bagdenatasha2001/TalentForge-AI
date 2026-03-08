package com.talentforge.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    // Step 1
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String dateOfBirth;

    // Step 2
    private String degree;
    private String institution;
    private Integer graduationYear;
    private String major;

    // Step 3
    private String currentRole;
    private String company;
    private Double yearsOfExperience;
    private String pastRoles;

    // Step 4
    private String technicalSkills;
    private String softSkills;
    private String preferredRole;
    private String preferredLocation;
    private String careerGoal;

    // Step 5
    private boolean dataPrivacyAgreed;
    private boolean aiProcessingConsent;
}
