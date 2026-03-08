package com.talentforge.service;

import com.talentforge.dto.ApiResponse;
import com.talentforge.dto.LoginResponse;
import com.talentforge.dto.RegisterRequest;
import com.talentforge.entity.User;
import com.talentforge.repository.UserRepository;
import com.talentforge.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Transactional
    public ApiResponse<?> register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ApiResponse.error("An account with this email already exists.");
        }

        if (!req.isDataPrivacyAgreed() || !req.isAiProcessingConsent()) {
            return ApiResponse.error("You must agree to the Data Privacy Policy and AI Processing Consent.");
        }

        String otp = generateOtp();
        LocalDateTime otpExpiry = LocalDateTime.now().plusMinutes(10);

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .dateOfBirth(req.getDateOfBirth() != null ? LocalDate.parse(req.getDateOfBirth()) : null)
                .degree(req.getDegree())
                .institution(req.getInstitution())
                .graduationYear(req.getGraduationYear())
                .major(req.getMajor())
                .currentRole(req.getCurrentRole())
                .company(req.getCompany())
                .yearsOfExperience(req.getYearsOfExperience())
                .pastRoles(req.getPastRoles())
                .technicalSkills(req.getTechnicalSkills())
                .softSkills(req.getSoftSkills())
                .preferredRole(req.getPreferredRole())
                .preferredLocation(req.getPreferredLocation())
                .careerGoal(req.getCareerGoal())
                .role(User.Role.CANDIDATE)
                .verified(false)
                .otpCode(otp)
                .otpExpiresAt(otpExpiry)
                .dataPrivacyAgreed(req.isDataPrivacyAgreed())
                .aiProcessingConsent(req.isAiProcessingConsent())
                .build();

        // Save unverified — will be saved but not accessible until verified
        userRepository.save(user);

        // Send OTP email asynchronously
        emailService.sendOtpEmail(req.getEmail(), req.getFullName(), otp);

        log.info("New user registered (unverified): {}", req.getEmail());

        return ApiResponse.success("Registration successful! Please check your email for the verification code.",
                Map.of("email", req.getEmail()));
    }

    @Transactional
    public ApiResponse<?> verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (user.isVerified()) {
            return ApiResponse.error("Account is already verified.");
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(otp)) {
            return ApiResponse.error("Invalid verification code. Please try again.");
        }

        if (user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            return ApiResponse.error("Verification code has expired. Please request a new one.");
        }

        user.setVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        log.info("User verified successfully: {}", email);

        return ApiResponse.success("Account verified successfully! Welcome to TalentForge.",
                LoginResponse.builder()
                        .token(token)
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .userId(user.getId())
                        .build());
    }

    @Transactional
    public ApiResponse<?> resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (user.isVerified()) {
            return ApiResponse.error("Account is already verified.");
        }

        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendOtpEmail(email, user.getFullName(), otp);

        return ApiResponse.success("A new verification code has been sent to your email.", null);
    }

    public ApiResponse<?> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ApiResponse.error("Invalid email or password.");
        }

        if (!user.isVerified()) {
            return ApiResponse.error("Account not verified. Please check your email for the OTP code.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        log.info("User logged in: {}", email);

        return ApiResponse.success("Login successful.",
                LoginResponse.builder()
                        .token(token)
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .userId(user.getId())
                        .build());
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
