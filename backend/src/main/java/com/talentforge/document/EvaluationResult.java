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

@Document(collection = "evaluation_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResult {

    @Id
    private String id;

    private Long userId;
    private Long jdRecordId;
    private Long testSessionId;

    private Double technicalDepthScore;
    private Double jdSkillAlignmentScore;
    private Double responsibilityCoverageScore;
    private Double projectAuthenticityScore;
    private Double communicationClarityScore;

    private List<String> weakAreas;
    private List<String> strongAreas;
    private String overallFeedback;
    private String improvementSuggestions;

    private LocalDateTime createdAt;
}
