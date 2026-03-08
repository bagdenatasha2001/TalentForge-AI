package com.talentforge.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentforge.entity.JdRecord;
import com.talentforge.entity.User;
import com.talentforge.repository.JdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class JdService {

    private final JdRepository jdRepository;
    private final ForgeAiService forgeAiService;

    @Transactional
    public JdRecord analyzeJd(User user, String jdText, String jobTitle) {
        JdRecord record = JdRecord.builder()
                .user(user)
                .jdText(jdText)
                .jobTitle(jobTitle != null ? jobTitle : "")
                .status(JdRecord.JdStatus.PENDING)
                .build();
        record = jdRepository.save(record);

        try {
            Map<String, Object> extraction = forgeAiService.extractSkills(user.getId(), jdText, jobTitle);

            record.setRequiredSkills(toJson(extraction.get("required_skills")));
            record.setRequiredTools(toJson(extraction.get("required_tools")));
            record.setCoreResponsibilities(toJson(extraction.get("core_responsibilities")));
            record.setExperienceLevel(str(extraction.get("experience_level")));
            record.setSoftSkills(toJson(extraction.get("soft_skills")));
            record.setSkillMatchScore(toDouble(extraction.get("skill_match_score")));
            record.setResponsibilityMatchScore(toDouble(extraction.get("responsibility_match_score")));
            record.setStatus(JdRecord.JdStatus.ANALYZED);

            if (record.getJobTitle().isBlank() && extraction.containsKey("job_title")) {
                record.setJobTitle(str(extraction.get("job_title")));
            }

            record = jdRepository.save(record);
            log.info("JD analyzed for user {}: {}", user.getId(), jobTitle);
        } catch (Exception e) {
            log.error("JD analysis failed: {}", e.getMessage());
            record.setStatus(JdRecord.JdStatus.ANALYZED);
            jdRepository.save(record);
        }

        return record;
    }

    public List<JdRecord> getUserJdHistory(Long userId) {
        return jdRepository.findByUserIdOrderByCreatedDateDesc(userId);
    }

    public JdRecord getJdById(Long jdId, Long userId) {
        return jdRepository.findById(jdId)
                .filter(jd -> jd.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("JD record not found."));
    }

    private String toJson(Object obj) {
        if (obj == null)
            return "[]";
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            return obj.toString();
        }
    }

    private String str(Object obj) {
        return obj != null ? obj.toString() : "";
    }

    private Double toDouble(Object obj) {
        if (obj == null)
            return 0.0;
        try {
            return Double.parseDouble(obj.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
