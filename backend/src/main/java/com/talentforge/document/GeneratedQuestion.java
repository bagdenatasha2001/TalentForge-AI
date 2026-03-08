package com.talentforge.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "generated_questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedQuestion {

    @Id
    private String id;

    private Long userId;
    private Long jdRecordId;
    private String sessionId;

    private String questionText;
    private String questionType; // TECHNICAL, SCENARIO, HR, CODING

    private String interviewStyleAnswer;
    private String developerStyleAnswer;
    private String explanation;
    private List<String> keyPoints;
    private String codingSolution;
    private String responsibilityMapping;
    private String skillTag;
    private String difficultyLevel;

    // Strict Interrogation fields
    private boolean interrogationEnabled;
    private String interrogationQuestion;
    private String deepCounterQuestion;
    private String crossVerificationTrap;
    private String modelInterrogationAnswer;

    // Tracking
    private boolean answered;
    private String userAnswer;
    private Double answerScore;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
