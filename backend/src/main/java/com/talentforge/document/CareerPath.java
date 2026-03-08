package com.talentforge.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "career_paths")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerPath {

    @Id
    private String id;

    private Long userId;
    private Long jdRecordId;

    private List<String> suitableRoles;
    private String salaryRange;
    private String marketDemand;
    private String marketInsights;

    private List<RoadmapWeek> thirtyDayRoadmap;

    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapWeek {
        private String week;
        private String focus;
        private List<String> tasks;
        private List<String> resources;
    }
}
