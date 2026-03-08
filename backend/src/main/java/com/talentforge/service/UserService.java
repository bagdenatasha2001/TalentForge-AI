package com.talentforge.service;

import com.talentforge.entity.User;
import com.talentforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        throw new RuntimeException("Authenticated user not found.");
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @Transactional
    public User updateProfile(Long userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("fullName"))
            user.setFullName((String) updates.get("fullName"));
        if (updates.containsKey("phone"))
            user.setPhone((String) updates.get("phone"));
        if (updates.containsKey("currentRole"))
            user.setCurrentRole((String) updates.get("currentRole"));
        if (updates.containsKey("company"))
            user.setCompany((String) updates.get("company"));
        if (updates.containsKey("technicalSkills"))
            user.setTechnicalSkills((String) updates.get("technicalSkills"));
        if (updates.containsKey("softSkills"))
            user.setSoftSkills((String) updates.get("softSkills"));
        if (updates.containsKey("preferredRole"))
            user.setPreferredRole((String) updates.get("preferredRole"));
        if (updates.containsKey("preferredLocation"))
            user.setPreferredLocation((String) updates.get("preferredLocation"));
        if (updates.containsKey("careerGoal"))
            user.setCareerGoal((String) updates.get("careerGoal"));

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found.");
        }
        userRepository.deleteById(userId);
    }
}
