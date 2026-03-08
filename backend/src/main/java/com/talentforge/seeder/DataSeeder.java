package com.talentforge.seeder;

import com.talentforge.entity.User;
import com.talentforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    public void seedData() {
        try {
            seedAdmin();
            seedDemoUser();
        } catch (Exception e) {
            log.warn("DataSeeder: Could not seed data — {}", e.getMessage());
        }
    }

    private void seedAdmin() {
        if (userRepository.findByEmail("TalentForgeAI").isEmpty()) {
            User admin = User.builder()
                    .fullName("TalentForge Admin")
                    .email("TalentForgeAI")
                    .password(passwordEncoder.encode("ForgeAI@1412"))
                    .role(User.Role.ADMIN)
                    .verified(true)
                    .dataPrivacyAgreed(true)
                    .aiProcessingConsent(true)
                    .currentRole("System Administrator")
                    .technicalSkills("Platform Management, AI Monitoring, System Analytics")
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin user seeded: TalentForgeAI (ADMIN, verified=true)");
        } else {
            log.info("ℹ️  Admin user already exists, skipping.");
        }
    }

    private void seedDemoUser() {
        if (userRepository.findByEmail("demo@talentforge.ai").isEmpty()) {
            User demo = User.builder()
                    .fullName("Alex Demo")
                    .email("demo@talentforge.ai")
                    .password(passwordEncoder.encode("Demo@1234"))
                    .role(User.Role.CANDIDATE)
                    .verified(true)
                    .phone("+1-555-0199")
                    .degree("B.Tech Computer Science")
                    .institution("IIT Mumbai")
                    .graduationYear(2022)
                    .major("Computer Science")
                    .currentRole("Software Engineer")
                    .company("TechCorp Ltd")
                    .yearsOfExperience(2.5)
                    .technicalSkills("Java, Spring Boot, Angular, Python, PostgreSQL, MongoDB, Docker")
                    .softSkills("Problem Solving, Communication, Teamwork, Adaptability")
                    .preferredRole("Senior Software Engineer")
                    .preferredLocation("Bangalore, India")
                    .careerGoal("Become a full-stack architect and lead engineering teams at scale")
                    .dataPrivacyAgreed(true)
                    .aiProcessingConsent(true)
                    .build();
            userRepository.save(demo);
            log.info("✅ Demo user seeded: demo@talentforge.ai (CANDIDATE, verified=true)");
        } else {
            log.info("ℹ️  Demo user already exists, skipping.");
        }
    }
}
