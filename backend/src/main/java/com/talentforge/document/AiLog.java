package com.talentforge.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "ai_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiLog {

    @Id
    private String id;

    private Long userId;
    private String endpoint;
    private String requestSummary;
    private String responseSummary;
    private String model;
    private Integer tokensUsed;
    private Long processingTimeMs;
    private boolean success;
    private String errorMessage;
    private LocalDateTime createdAt;
}
